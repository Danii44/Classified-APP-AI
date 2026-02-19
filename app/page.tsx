'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Search, Heart, MessageCircle, MapPin, Package2, Star, 
  Zap, Shield, TrendingUp, Clock, Eye, Share2, Menu, X,
  Home, Smartphone, Laptop, Car, Sofa, Briefcase, BookOpen,
  Flame, Users, CreditCard, Bell, Settings, LogOut, User,
  ChevronDown, ArrowRight, Check
} from 'lucide-react'

export default function HomePage() {
  const supabase = createClient()
  const { theme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [listings, setListings] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [countries, setCountries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    country: 'AE',
    minPrice: '',
    maxPrice: '',
  })

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
    }
    checkUser()
  }, [supabase])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsRes, categoriesRes, countriesRes] = await Promise.all([
          fetch('/api/listings'),
          fetch('/api/metadata?type=categories'),
          fetch('/api/metadata?type=countries'),
        ])

        const listingsData = await listingsRes.json()
        const categoriesData = await categoriesRes.json()
        const countriesData = await countriesRes.json()

        // Ensure data is always an array
        setListings(Array.isArray(listingsData) ? listingsData : listingsData?.data || [])
        setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || [])
        setCountries(Array.isArray(countriesData) ? countriesData : countriesData?.data || [])
      } catch (error) {
        console.error('[Homepage] Error fetching data:', error)
        // Set empty arrays on error
        setListings([])
        setCategories([])
        setCountries([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.category) params.append('categoryId', filters.category)
      if (filters.country) params.append('countryId', filters.country)
      if (filters.minPrice) params.append('priceMin', filters.minPrice)
      if (filters.maxPrice) params.append('priceMax', filters.maxPrice)

      const response = await fetch(`/api/listings?${params.toString()}`)
      const data = await response.json()
      setListings(data)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const isDark = theme === 'dark'
  const bgGradient = isDark 
    ? 'from-slate-950 via-blue-950 to-slate-950'
    : 'from-blue-50 via-white to-purple-50'
  const navBg = isDark ? 'bg-slate-900/95' : 'bg-white/95'
  const textPrimary = isDark ? 'text-white' : 'text-slate-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const cardBg = isDark ? 'bg-slate-800' : 'bg-white'
  const borderColor = isDark ? 'border-slate-700' : 'border-blue-100'

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      {/* Header/Navigation */}
      <nav className={`sticky top-0 z-50 ${navBg} backdrop-blur border-b ${borderColor} transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-600' : 'bg-blue-100'}`}>
                <Package2 className={`w-6 h-6 ${isDark ? 'text-white' : 'text-blue-600'}`} />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className={`text-xl font-bold ${textPrimary}`}>NEXUS</span>
                <span className="text-xs text-blue-500">Marketplace UAE</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/browse" className={`${textSecondary} hover:${isDark ? 'text-white' : 'text-slate-900'} transition text-sm`}>
                Browse
              </Link>
              <Link href="/sell" className={`${textSecondary} hover:${isDark ? 'text-white' : 'text-slate-900'} transition text-sm`}>
                Sell Now
              </Link>
              <Link href="/help" className={`${textSecondary} hover:${isDark ? 'text-white' : 'text-slate-900'} transition text-sm`}>
                Help
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              
              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Bell className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/messages">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/listings/create">
                    <Button className="bg-blue-600 hover:bg-blue-700 gap-2 text-white">
                      <Zap className="w-4 h-4" />
                      Post Ad
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className={`md:hidden pb-4 border-t ${borderColor}`}>
              <Link href="/browse" className={`block py-2 ${textSecondary}`}>
                Browse
              </Link>
              <Link href="/sell" className={`block py-2 ${textSecondary}`}>
                Sell Now
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" className={`block py-2 ${textSecondary}`}>
                    Dashboard
                  </Link>
                  <Link href="/listings/create" className={`block py-2 ${textSecondary}`}>
                    Post Ad
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className={`block py-2 ${textSecondary}`}>
                    Sign In
                  </Link>
                  <Link href="/auth/sign-up" className={`block py-2 ${textSecondary}`}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className={`relative overflow-hidden py-16 md:py-24`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${textPrimary} leading-tight`}>
              Find Everything in the <span className="text-blue-500">UAE</span>
            </h1>
            <p className={`text-xl ${textSecondary} max-w-2xl mx-auto`}>
              The fastest-growing classifieds marketplace. Buy, sell, and trade with millions of users.
            </p>
          </div>

          {/* Advanced Search Bar */}
          <div className={`max-w-4xl mx-auto space-y-4 mb-8`}>
            <div className={`${cardBg} rounded-2xl p-6 border ${borderColor} shadow-xl`}>
              {/* Main Search */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className={`absolute left-3 top-3 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  <Input
                    placeholder="What are you looking for?"
                    className={`pl-10 h-12 text-base rounded-lg ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-lg"
                  disabled={loading}
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Select value={filters.country} onValueChange={(v) => setFilters({ ...filters, country: v })}>
                  <SelectTrigger className={`rounded-lg h-10 ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50'}`}>
                    <MapPin className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(countries) && countries.length > 0 ? (
                      countries.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="AE" disabled>No countries available</SelectItem>
                    )}
                  </SelectContent>
                </Select>

                <Select value={filters.category} onValueChange={(v) => setFilters({ ...filters, category: v })}>
                  <SelectTrigger className={`rounded-lg h-10 ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50'}`}>
                    <Package2 className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(categories) && categories.length > 0 ? (
                      categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>No categories available</SelectItem>
                    )}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Min AED"
                  type="number"
                  className={`rounded-lg h-10 ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50'}`}
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                />

                <Input
                  placeholder="Max AED"
                  type="number"
                  className={`rounded-lg h-10 ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50'}`}
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />
              </div>
            </div>

            {/* Quick Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { name: 'Phones', icon: Smartphone },
                { name: 'Cars', icon: Car },
                { name: 'Apartments', icon: Home },
                { name: 'Furniture', icon: Sofa },
                { name: 'Jobs', icon: Briefcase },
              ].map((cat) => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.name}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-900'}`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-3xl font-bold ${textPrimary} flex items-center gap-2`}>
              <Flame className="w-8 h-8 text-orange-500" />
              Hot Deals
            </h2>
            <p className={textSecondary}>Most viewed listings today</p>
          </div>
          <Link href="/browse?sort=hot">
            <Button variant="outline" className="gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className={`text-center py-12 ${textSecondary}`}>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.slice(0, 8).map((listing) => (
              <Link key={listing.id} href={`/listings/${listing.id}`}>
                <Card className={`overflow-hidden hover:shadow-lg transition cursor-pointer ${cardBg} border ${borderColor}`}>
                  <div className="relative aspect-square bg-gradient-to-br from-slate-700 to-slate-800">
                    {listing.listing_media?.[0]?.url ? (
                      <img
                        src={listing.listing_media[0].url}
                        alt={listing.title}
                        className="w-full h-full object-cover hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package2 className="w-12 h-12 text-gray-600" />
                      </div>
                    )}

                    {listing.is_featured && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        FEATURED
                      </div>
                    )}

                    <button className={`absolute top-3 left-3 p-2 rounded-full transition ${isDark ? 'bg-slate-900/80 hover:bg-slate-900' : 'bg-white/80 hover:bg-white'}`}>
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className={`font-semibold line-clamp-2 ${textPrimary} mb-2`}>
                      {listing.title}
                    </h3>
                    <p className={`text-sm line-clamp-1 mb-3 ${textSecondary}`}>
                      {listing.description}
                    </p>

                    <div className={`flex items-center gap-1 text-xs ${textSecondary} mb-3`}>
                      <MapPin className="w-3 h-3" />
                      <span>Dubai</span>
                    </div>

                    <div className="pt-3 border-t border-opacity-10 flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-blue-500">
                          د.إ {listing.price?.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Eye className={`w-4 h-4 ${textSecondary}`} />
                        <span className={`text-xs ${textSecondary}`}>245</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className={`py-16 ${isDark ? 'bg-slate-800/50' : 'bg-blue-50/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-center mb-12 ${textPrimary}`}>Why Choose NEXUS?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Safe & Secure', desc: 'Buyer protection & verified sellers' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Post ads instantly, get replies quickly' },
              { icon: TrendingUp, title: 'Best Prices', desc: 'Market-competitive listings & deals' },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className={`p-6 rounded-xl border ${borderColor} ${cardBg}`}>
                  <Icon className="w-8 h-8 text-blue-500 mb-3" />
                  <h3 className={`font-bold mb-2 ${textPrimary}`}>{feature.title}</h3>
                  <p className={textSecondary}>{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className={`text-3xl font-bold mb-4 ${textPrimary}`}>Ready to Sell?</h2>
        <p className={`text-lg ${textSecondary} mb-8 max-w-2xl mx-auto`}>
          Post your first ad for free. No hidden fees. Reach millions of buyers.
        </p>
        <Link href={user ? '/listings/create' : '/auth/sign-up'}>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg gap-2">
            <Zap className="w-5 h-5" />
            Post Free Ad Now
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className={`border-t ${borderColor} ${isDark ? 'bg-slate-900/50' : 'bg-blue-50/50'} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {[
              { title: 'Browse', links: ['Electronics', 'Vehicles', 'Real Estate', 'Jobs'] },
              { title: 'Sell', links: ['Post Ad', 'My Listings', 'My Account', 'Messages'] },
              { title: 'Help', links: ['Safety', 'FAQ', 'Contact Us', 'Report Abuse'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Terms'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className={`font-bold mb-3 ${textPrimary}`}>{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className={`text-sm ${textSecondary} hover:text-blue-500`}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className={`text-center text-sm ${textSecondary} border-t ${borderColor} pt-8`}>
            <p>&copy; 2024 NEXUS Marketplace. All rights reserved. | Made for the UAE</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
