'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { getSubscriptionPlans, createSubscriptionCheckout } from '@/lib/payment-utils'

interface Plan {
  id: string
  plan_name: string
  plan_type: 'free' | 'premium' | 'premium_plus'
  price: number
  currency: string
  max_ads: number
  max_featured_ads: number
  max_bump_ups_per_month: number
  features: Record<string, any>
}

interface SubscriptionPlansProps {
  userId: string
  onSelectPlan?: (planId: string) => void
}

export function SubscriptionPlans({ userId, onSelectPlan }: SubscriptionPlansProps) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const data = await getSubscriptionPlans()
      setPlans(data as Plan[])
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPlan = async (plan: Plan) => {
    if (plan.plan_type === 'free') {
      // Free plan, just select it
      onSelectPlan?.(plan.id)
      setSelectedPlan(plan.id)
    } else {
      // Premium plans, initiate checkout
      try {
        const session = await createSubscriptionCheckout(userId, plan.id)
        if (session.url) {
          window.location.href = session.url
        }
      } catch (error) {
        console.error('Error creating checkout:', error)
      }
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading subscription plans...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
      {plans.map(plan => (
        <Card key={plan.id} className={`relative p-6 flex flex-col ${plan.plan_type === 'premium_plus' ? 'ring-2 ring-blue-500' : ''}`}>
          {plan.plan_type === 'premium_plus' && (
            <Badge className="absolute top-4 right-4 bg-blue-500">Popular</Badge>
          )}

          <div className="mb-6">
            <h3 className="text-2xl font-bold">{plan.plan_name}</h3>
            <p className="text-gray-600 mt-2">
              {plan.price === 0 ? (
                <span className="text-3xl font-bold">Free</span>
              ) : (
                <span className="text-3xl font-bold">
                  AED {plan.price}
                  <span className="text-sm text-gray-600">/month</span>
                </span>
              )}
            </p>
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <Check size={18} className="text-green-600" />
              <span>{plan.max_ads} ads</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={18} className="text-green-600" />
              <span>{plan.max_featured_ads} featured ads</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={18} className="text-green-600" />
              <span>{plan.max_bump_ups_per_month} bumps/month</span>
            </div>

            {plan.features?.ad_posting && (
              <div className="flex items-center gap-2">
                <Check size={18} className="text-green-600" />
                <span>Ad posting</span>
              </div>
            )}

            {plan.features?.messaging && (
              <div className="flex items-center gap-2">
                <Check size={18} className="text-green-600" />
                <span>Direct messaging</span>
              </div>
            )}

            {plan.features?.priority_support && (
              <div className="flex items-center gap-2">
                <Check size={18} className="text-green-600" />
                <span>Priority support</span>
              </div>
            )}

            {plan.features?.analytics && (
              <div className="flex items-center gap-2">
                <Check size={18} className="text-green-600" />
                <span>Analytics dashboard</span>
              </div>
            )}
          </div>

          <Button
            onClick={() => handleSelectPlan(plan)}
            variant={plan.plan_type === 'free' ? 'outline' : 'default'}
            className="w-full mt-6"
            disabled={selectedPlan === plan.id}
          >
            {selectedPlan === plan.id ? 'Selected' : plan.price === 0 ? 'Choose Free' : 'Upgrade Now'}
          </Button>
        </Card>
      ))}
    </div>
  )
}
