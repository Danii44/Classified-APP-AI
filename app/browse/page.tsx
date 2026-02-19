'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Heart, MapPin, Clock, AlertCircle } from 'lucide-react'

interface Listing {
  id: string
  title: string
  price: number
  currency: string
  city: string
  country: string
  created_at: string
  images?: Array<{ image_url: string }>
  category?: { category_name: string }
  user?: { first_name: string; last_name: string }
}

interface Filters {
  search: string
  category: string
  country: string
  priceMin: string
  priceMax: string
  sortBy: string
}

export default function BrowsePage() {
  const supabase = createClient()
  const [listings, setListings] = useState<Listing[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: '',
    country: '',
    priceMin: '',
    priceMax: '',
    sortBy: 'newest',
  })

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await supabase
          .from('categories')
          .select('id, category_name')
          .is('parent_category_id', null)
          .order('display_order')

        setCategories(data || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch listings based on filters
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      try {
        let query = supabase
          .from('ads')
          .select(`
            id,
            title,
            price,
            currency,
            city,
            country,
            created_at,
            ad_images(image_url),
            categories(category_name),
            users(first_name, last_name)
          `)
          .eq('status', 'active')
          .is('deleted_at', null)

        if (filters.search) {
          query = query.ilike('title', `%${filters.search}%`)
        }
        if (filters.category) {
          query = query.eq('category_id', filters.category)
        }
        if (filters.country) {
          query = query.eq('country', filters.country)
        }
        if (filters.priceMin) {
          query = query.gte('price', parseFloat(filters.priceMin))
        }
        if (filters.priceMax) {
          query = query.lte('price', parseFloat(filters.priceMax))
        }

        const orderMap: Record<string, [string, { ascending: boolean }]> = {
          newest: ['created_at', { ascending: false }],
          oldest: ['created_at', { ascending: true }],
          price_low: ['price', { ascending: true }],
          price_high: ['price', { ascending: false }],
        }

        const [orderBy, orderOptions] = orderMap[filters.sortBy] || orderMap.newest
        query = query.order(orderBy, orderOptions)

        const { data } = await query.limit(24)
        setListings(data || [])
      } catch (error) {
        console.error('Error fetching listings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [filters, supabase])

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-8 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Browse Listings</h1>
          <p className="text-blue-100">Find amazing deals from sellers near you</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
              <Input
                placeholder="Search listings..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
              <Select value={filters.country} onValueChange={(value) => handleFilterChange('country', value)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Countries</SelectItem>
                  <SelectItem value="AE">UAE</SelectItem>
                  <SelectItem value="SA">Saudi Arabia</SelectItem>
                  <SelectItem value="KW">Kuwait</SelectItem>
                  <SelectItem value="QA">Qatar</SelectItem>
                  <SelectItem value="BH">Bahrain</SelectItem>
                  <SelectItem value="OM">Oman</SelectItem>
                  <SelectItem value="EG">Egypt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Min Price</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.priceMin}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Price</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.priceMax}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No listings found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <Link key={listing.id} href={`/listing/${listing.id}`}>
                <Card className="glass hover:border-blue-400 transition-all hover:shadow-lg cursor-pointer h-full">
                  {/* Image */}
                  <div className="relative h-40 bg-slate-700 rounded-t-xl overflow-hidden">
                    {listing.images?.[0]?.image_url ? (
                      <img
                        src={listing.images[0].image_url}
                        alt={listing.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
                    )}
                    <button className="absolute top-2 right-2 p-2 bg-slate-900/80 rounded-full hover:bg-red-600 transition">
                      <Heart className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Content */}
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2 text-white">{listing.title}</CardTitle>
                    <CardDescription className="text-blue-400 text-lg font-semibold">
                      {listing.currency} {listing.price?.toLocaleString()}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4" />
                      {listing.city}, {listing.country}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      {new Date(listing.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      by {listing.user?.first_name || 'Seller'}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
