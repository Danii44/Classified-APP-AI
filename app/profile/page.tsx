'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { User, Mail, Phone, LogOut, Save, Package2, Star } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
  })
  const [rating, setRating] = useState({ average: 0, count: 0 })

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session?.user) {
        router.push('/auth/login')
      } else {
        setUser(data.session.user)
        await fetchProfile(data.session.user.id)
      }
    }
    checkAuth()
  }, [supabase, router])

  const fetchProfile = async (userId: string) => {
    try {
      const [profileRes, ratingRes] = await Promise.all([
        fetch(`/api/profiles/${userId}`),
        fetch(`/api/users/${userId}/rating`),
      ])

      const profileData = await profileRes.json()
      const ratingData = await ratingRes.json()

      setProfile(profileData)
      setFormData({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        phone: profileData.phone || '',
        bio: profileData.bio || '',
      })
      setRating(ratingData)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      await fetch(`/api/profiles/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      await fetchProfile(user.id)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading || !user) return null

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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0 p-8 mb-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
              {formData.first_name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {formData.first_name} {formData.last_name}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span className="font-semibold">{rating.average}</span>
                  <span className="text-sm opacity-80">({rating.count} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Form */}
        <Card className="bg-slate-800 border-slate-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>

          <div className="space-y-6">
            {/* Names */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <Input
                  placeholder="First name"
                  className="bg-slate-700 border-slate-600 text-white"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <Input
                  placeholder="Last name"
                  className="bg-slate-700 border-slate-600 text-white"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <Input
                  disabled
                  type="email"
                  value={user.email || ''}
                  className="bg-slate-700 border-slate-600 text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </label>
                <Input
                  placeholder="+1 (555) 000-0000"
                  className="bg-slate-700 border-slate-600 text-white"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
              <Textarea
                placeholder="Tell buyers about yourself..."
                className="bg-slate-700 border-slate-600 text-white min-h-24"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            {/* Account Info */}
            <div className="pt-6 border-t border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Account Status:</span>
                  <span className="text-green-400 font-semibold capitalize">{profile?.status || 'active'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Account Type:</span>
                  <span className="text-blue-400 font-semibold capitalize">{profile?.role || 'user'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Member Since:</span>
                  <span className="text-gray-300">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-4 pt-6">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full border-slate-600 text-gray-300 hover:text-white">
                  My Listings
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
