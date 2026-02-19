'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useTheme } from 'next-themes'
import {
  Settings, ToggleLeft, ToggleRight, CreditCard, Users, 
  TrendingUp, Zap, DollarSign, AlertCircle, Check, Clock
} from 'lucide-react'

export default function AdminDashboard() {
  const supabase = createClient()
  const { theme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [featureFlags, setFeatureFlags] = useState<any[]>([])
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const isDark = theme === 'dark'

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      const sessionUser = data.session?.user
      setUser(sessionUser || null)
      
      if (!sessionUser) {
        window.location.href = '/auth/login'
        return
      }

      // Check if user is admin
      try {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('role')
          .eq('id', sessionUser.id)
          .single()

        if (!adminData) {
          window.location.href = '/'
          return
        }

        setIsAdmin(true)
        fetchFeatureFlags()
        fetchSubscriptionPlans()
      } catch (error) {
        console.error('Error checking admin status:', error)
        window.location.href = '/'
        return
      }
    }

    checkAuth()
  }, [supabase])

  const fetchFeatureFlags = async () => {
    try {
      const { data } = await supabase
        .from('feature_flags')
        .select('*')
      
      setFeatureFlags(data || [])
    } catch (error) {
      console.error('Error fetching feature flags:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubscriptionPlans = async () => {
    // Placeholder - implement subscription plans table
    setSubscriptionPlans([
      {
        id: 'free',
        name: 'Free',
        price: 0,
        listings_per_month: 5,
        featured_listings: 0,
        priority_support: false,
      },
      {
        id: 'pro',
        name: 'Pro Monthly',
        price: 199,
        currency: 'AED',
        listings_per_month: 50,
        featured_listings: 5,
        priority_support: true,
        period: 'monthly',
      },
      {
        id: 'premium',
        name: 'Premium Yearly',
        price: 1999,
        currency: 'AED',
        listings_per_month: 'unlimited',
        featured_listings: 50,
        priority_support: true,
        period: 'yearly',
      },
    ])
  }

  const toggleFeature = async (featureId: string, currentStatus: boolean) => {
    try {
      await supabase
        .from('feature_flags')
        .update({ enabled: !currentStatus })
        .eq('id', featureId)

      setFeatureFlags(
        featureFlags.map((f) =>
          f.id === featureId ? { ...f, enabled: !currentStatus } : f
        )
      )
    } catch (error) {
      console.error('Error updating feature:', error)
    }
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Admin Dashboard
              </h1>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Manage features, subscriptions, and platform settings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Feature Flags Section */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Zap className="w-6 h-6 text-yellow-500" />
            Feature Flags
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featureFlags.map((flag) => (
              <Card
                key={flag.id}
                className={`p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {flag.feature_name}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {flag.description || 'No description'}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <div className="flex items-center gap-2">
                      {flag.enabled ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      <Switch
                        checked={flag.enabled}
                        onCheckedChange={() => toggleFeature(flag.id, flag.enabled)}
                        className="cursor-pointer"
                      />
                    </div>
                    <span className={`text-xs ${flag.enabled ? 'text-green-500' : 'text-red-500'}`}>
                      {flag.enabled ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Subscription Plans Section */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <CreditCard className="w-6 h-6 text-blue-500" />
            Subscription Plans
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`p-8 relative overflow-hidden ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                } ${plan.id === 'premium' ? 'ring-2 ring-blue-500 md:scale-105' : ''}`}
              >
                {plan.id === 'premium' && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                    POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-blue-500">{plan.price}</span>
                    {plan.period && (
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        /{plan.period === 'monthly' ? 'month' : 'year'}
                      </span>
                    )}
                  </div>
                  {plan.currency && (
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {plan.currency}
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      {plan.listings_per_month === 'unlimited'
                        ? 'Unlimited listings'
                        : `${plan.listings_per_month} listings/month`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      {plan.featured_listings} featured listings
                    </span>
                  </div>
                  {plan.priority_support && (
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        Priority support
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  className={`w-full ${
                    plan.id === 'free'
                      ? 'bg-gray-300 text-gray-900'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {plan.id === 'free' ? 'Current Plan' : 'Edit Plan'}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Settings */}
        <div>
          <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <DollarSign className="w-6 h-6 text-green-500" />
            Payment Settings
          </h2>

          <Card className={`p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Stripe Configuration
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className={`text-sm block mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Publishable Key
                    </label>
                    <input
                      type="password"
                      placeholder="pk_..."
                      className={`w-full px-3 py-2 rounded border ${
                        isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`text-sm block mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Secret Key
                    </label>
                    <input
                      type="password"
                      placeholder="sk_..."
                      className={`w-full px-3 py-2 rounded border ${
                        isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-300'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Payment Methods
                </h3>
                <div className="space-y-2">
                  {[
                    { name: 'Stripe', enabled: true },
                    { name: 'PayPal', enabled: false },
                    { name: 'Apple Pay', enabled: false },
                    { name: 'Google Pay', enabled: false },
                  ].map((method) => (
                    <div key={method.name} className="flex items-center justify-between p-3 rounded bg-opacity-50">
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        {method.name}
                      </span>
                      <Switch checked={method.enabled} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
