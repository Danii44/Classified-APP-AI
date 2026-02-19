'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, MapPin, Clock, User, Phone, Mail, AlertCircle } from 'lucide-react'

interface ListingDetail {
  id: string
  title: string
  description: string
  price: number
  currency: string
  city: string
  country: string
  condition: string
  created_at: string
  views_count: number
  images?: Array<{ image_url: string }>
  category?: { category_name: string }
  user?: {
    id: string
    email: string
    phone: string
    first_name: string
    last_name: string
    avatar_url: string
    average_rating: number
    total_reviews: number
    total_ads_sold: number
  }
}

export default function ListingDetailPage() {
  const params = useParams()
  const supabase = createClient()
  const listingId = params.id as string
  const [listing, setListing] = useState<ListingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) return

      try {
        const { data, error: fetchError } = await supabase
          .from('ads')
          .select(`
            id,
            title,
            description,
            price,
            currency,
            city,
            country,
            condition,
            created_at,
            views_count,
            ad_images(image_url),
            categories(category_name),
            users(
              id,
              email,
              phone,
              avatar_url
            ),
            user_profiles(
              first_name,
              last_name,
              average_rating,
              total_reviews,
              total_ads_sold
            )
          `)
          .eq('id', listingId)
          .single()

        if (fetchError) {
          setError('Listing not found')
          return
        }

        // Increment view count
        await supabase
          .from('ads')
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq('id', listingId)

        setListing(data)
      } catch (err: any) {
        setError(err.message || 'Error loading listing')
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [listingId, supabase])

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-8">
        <div className="max-w-7xl mx-auto flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </main>
    )
  }

  if (error || !listing) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="glass rounded-2xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-white text-lg">{error}</p>
          </div>
        </div>
      </main>
    )
  }

  const sellerProfile = listing.user_profiles?.[0]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <Card className="glass mb-6">
              <div className="relative bg-slate-700 rounded-t-xl overflow-hidden" style={{ height: '400px' }}>
                {listing.images?.[selectedImageIndex]?.image_url ? (
                  <img
                    src={listing.images[selectedImageIndex].image_url}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
                )}
                <button className="absolute top-4 right-4 p-3 bg-slate-900/80 rounded-full hover:bg-red-600 transition">
                  <Heart className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Image Thumbnails */}
              {listing.images && listing.images.length > 1 && (
                <CardContent className="pt-4">
                  <div className="flex gap-2">
                    {listing.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                          idx === selectedImageIndex ? 'border-blue-500' : 'border-slate-700'
                        }`}
                      >
                        <img src={img.image_url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Details */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-3xl text-white">{listing.title}</CardTitle>
                <div className="flex items-center gap-4 mt-2 text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {listing.city}, {listing.country}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(listing.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Description</h3>
                  <p className="text-gray-400 leading-relaxed">{listing.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">Price</p>
                    <p className="text-xl font-bold text-blue-400">
                      {listing.currency} {listing.price?.toLocaleString()}
                    </p>
                  </div>
                  <div className="glass rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">Condition</p>
                    <p className="text-lg font-semibold text-white capitalize">{listing.condition}</p>
                  </div>
                  <div className="glass rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">Category</p>
                    <p className="text-lg font-semibold text-white">{listing.category?.category_name}</p>
                  </div>
                  <div className="glass rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">Views</p>
                    <p className="text-xl font-bold text-yellow-400">{listing.views_count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seller Info & Contact */}
          <div>
            <Card className="glass sticky top-20">
              <CardHeader>
                <CardTitle>Seller Information</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Seller Profile */}
                <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {(sellerProfile?.first_name?.[0] || 'S').toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {sellerProfile?.first_name} {sellerProfile?.last_name}
                    </p>
                    <p className="text-xs text-yellow-400">★ {sellerProfile?.average_rating || 5.0}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Ads Sold</span>
                    <span className="font-semibold text-white">{sellerProfile?.total_ads_sold || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Reviews</span>
                    <span className="font-semibold text-white">{sellerProfile?.total_reviews || 0}</span>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="space-y-3 pt-4 border-t border-slate-700">
                  <Button className="w-full bg-green-600 hover:bg-green-700 gap-2">
                    <Phone className="w-4 h-4" />
                    Call Seller
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
                    <Mail className="w-4 h-4" />
                    Message
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Always meet buyers in safe public places
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
