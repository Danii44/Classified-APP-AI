'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LogOut, Plus, Edit2, Trash2, Package2 } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session?.user) {
        router.push('/auth/login')
      } else {
        setUser(data.session.user)
        await fetchUserListings(data.session.user.id)
      }
    }
    checkAuth()
  }, [supabase, router])

  const fetchUserListings = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/listings`)
      const data = await response.json()
      setListings(data)
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleDelete = async (listingId: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      try {
        await fetch(`/api/listings/${listingId}`, { method: 'DELETE' })
        setListings(listings.filter((l) => l.id !== listingId))
      } catch (error) {
        console.error('Error deleting listing:', error)
      }
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-900/95 backdrop-blur border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Package2 className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-white">NexusMarket</span>
          </Link>
          <Button onClick={handleLogout} variant="ghost" className="text-gray-300 hover:text-white">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Listings</h1>
            <p className="text-gray-400">Manage your marketplace listings</p>
          </div>
          <Link href="/listings/create">
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Listing
            </Button>
          </Link>
        </div>

        {/* Listings */}
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : listings.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-12 text-center">
            <Package2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No listings yet</h3>
            <p className="text-gray-400 mb-6">Start by creating your first listing</p>
            <Link href="/listings/create">
              <Button className="bg-blue-600 hover:bg-blue-700">Create Your First Listing</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4">
            {listings.map((listing) => (
              <Card key={listing.id} className="bg-slate-800 border-slate-700 p-6 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{listing.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-1">{listing.description}</p>
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <span className="text-blue-400 font-semibold">
                      {listing.currency} {listing.price?.toLocaleString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        listing.status === 'active'
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-yellow-900/50 text-yellow-400'
                      }`}
                    >
                      {listing.status.toUpperCase()}
                    </span>
                    <span className="text-gray-500">{listing.view_count} views</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Link href={`/listings/${listing.id}/edit`}>
                    <Button variant="outline" size="sm" className="border-slate-600 text-gray-300 hover:text-white">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(listing.id)}
                    className="border-slate-600 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
