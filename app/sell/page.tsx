'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Upload } from 'lucide-react'

interface CreateListingForm {
  title: string
  description: string
  category: string
  price: string
  country: string
  city: string
  condition: string
}

export default function SellPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<CreateListingForm>({
    title: '',
    description: '',
    category: '',
    price: '',
    country: 'AE',
    city: '',
    condition: 'good',
  })

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session?.user) {
        router.push('/auth/login')
        return
      }
      setUser(data.session.user)
    }
    checkAuth()
  }, [supabase, router])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await supabase
          .from('categories')
          .select('id, category_name, slug')
          .is('parent_category_id', null)
          .order('display_order')

        setCategories(data || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!user) {
        setError('You must be logged in to create a listing')
        return
      }

      if (!form.title || !form.category || !form.price) {
        setError('Please fill in all required fields')
        return
      }

      const { error: insertError } = await supabase.from('ads').insert([
        {
          user_id: user.id,
          category_id: form.category,
          title: form.title,
          description: form.description,
          price: parseFloat(form.price),
          currency: 'AED',
          condition: form.condition,
          country: form.country,
          city: form.city,
          status: 'pending',
        },
      ])

      if (insertError) {
        setError(insertError.message || 'Failed to create listing')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Post Your Listing</h1>
          <p className="text-gray-400">Reach thousands of buyers in the UAE and GCC region</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="glass border-l-4 border-green-500 p-4 mb-6 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white">Listing Created Successfully!</h3>
              <p className="text-gray-400 text-sm">Redirecting to your dashboard...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="glass border-l-4 border-red-500 p-4 mb-6 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white">Error</h3>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Listing Details</CardTitle>
            <CardDescription>Provide accurate information about your item</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Listing Title <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g., iPhone 14 Pro, 256GB, Space Black"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Description</label>
                <Textarea
                  placeholder="Describe your item in detail. Include condition, features, and any defects..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  rows={6}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Price (AED) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Condition</label>
                <Select value={form.condition} onValueChange={(value) => setForm({ ...form, condition: value })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like_new">Like New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Country</label>
                  <Select value={form.country} onValueChange={(value) => setForm({ ...form, country: value })}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">City</label>
                  <Input
                    placeholder="e.g., Dubai"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? 'Creating...' : 'Post Listing'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                By posting, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
