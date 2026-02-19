'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Heart, Share2, MapPin, Clock, User, Star, MessageCircle, Package2 } from 'lucide-react'

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient()
  const [id, setId] = useState<string>('')
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [sellerRating, setSellerRating] = useState({ average: 0, count: 0 })

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
    }
    checkUser()
  }, [supabase])

  useEffect(() => {
    if (!id) return

    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${id}`)
        const data = await response.json()
        setListing(data)

        // Fetch seller rating
        if (data.user_id) {
          const ratingResponse = await fetch(`/api/users/${data.user_id}/rating`)
          const ratingData = await ratingResponse.json()
          setSellerRating(ratingData)
        }
      } catch (error) {
        console.error('Error fetching listing:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [id])

  const handleContactSeller = async () => {
    if (!user) {
      window.location.href = '/auth/login'
      return
    }

    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listing.id,
          seller_id: listing.user_id,
          buyer_id: user.id,
        }),
      })
      const conversation = await response.json()
      window.location.href = `/messages/${conversation.id}`
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-gray-400">Loading...</div>
      </div>
    )

  if (!listing)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-gray-400">Listing not found</div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-900/95 backdrop-blur border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Package2 className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-white">NexusMarket</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Back to Listings
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <Card className="bg-slate-800 border-slate-700 overflow-hidden mb-6">
              <div className="aspect-video bg-slate-700 flex items-center justify-center relative">
                {listing.listing_media?.[0]?.url ? (
                  <img
                    src={listing.listing_media[0].url}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package2 className="w-24 h-24 text-gray-600" />
                )}
              </div>

              {/* Thumbnails */}
              {listing.listing_media && listing.listing_media.length > 1 && (
                <div className="p-4 flex gap-2 border-t border-slate-700">
                  {listing.listing_media.map((media: any, idx: number) => (
                    <div key={idx} className="w-20 h-20 rounded border border-slate-600 overflow-hidden cursor-pointer hover:border-blue-500 transition">
                      <img src={media.url} alt={`${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Details */}
            <Card className="bg-slate-800 border-slate-700 p-6 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{listing.title}</h1>
                <p className="text-gray-400">{listing.description}</p>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
                <div className="space-y-3">
                  {listing.attributes &&
                    Object.entries(listing.attributes).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-400">{key}:</span>
                        <span className="text-white font-semibold">{String(value)}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6 flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{listing.view_count} views</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 p-6 text-white">
              <div className="text-sm text-blue-100 mb-2">Price</div>
              <div className="text-4xl font-bold mb-6">
                {listing.currency} {listing.price?.toLocaleString()}
              </div>
              <Button onClick={handleContactSeller} className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Seller
              </Button>
            </Card>

            {/* Seller Card */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Seller Information</h3>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {listing.profiles?.first_name?.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {listing.profiles?.first_name} {listing.profiles?.last_name}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">{listing.profiles?.role}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-white font-semibold">{sellerRating.average}</span>
                  <span className="text-gray-400 text-sm">({sellerRating.count} reviews)</span>
                </div>

                {listing.profiles?.bio && (
                  <p className="text-sm text-gray-400">{listing.profiles.bio}</p>
                )}

                {listing.profiles?.phone && (
                  <p className="text-sm text-gray-400">
                    <span className="text-gray-500">Phone:</span> {listing.profiles.phone}
                  </p>
                )}
              </div>

              <Button
                onClick={handleContactSeller}
                variant="outline"
                className="w-full border-slate-600 text-white hover:bg-slate-700"
              >
                View Seller Profile
              </Button>
            </Card>

            {/* Share & Save */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-slate-600 text-gray-300 hover:text-white">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" className="flex-1 border-slate-600 text-gray-300 hover:text-white">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Import Eye icon
import { Eye } from 'lucide-react'
