import { createClient } from '@/lib/supabase/client'
import Stripe from 'stripe'

const supabase = createClient()
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '', {
  apiVersion: '2023-10-16'
})

export interface SubscriptionPlan {
  id: string
  plan_name: string
  price: number
  max_ads: number
  max_featured_ads: number
  max_bump_ups_per_month: number
}

export interface UserWallet {
  id: string
  user_id: string
  balance: number
  currency: string
}

/**
 * Get available subscription plans
 */
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('id, plan_name, price, max_ads, max_featured_ads, max_bump_ups_per_month')
    .order('price')

  if (error) throw error
  return data || []
}

/**
 * Get user's current subscription
 */
export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('subscription_status, subscription_plan, subscription_expires_at')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

/**
 * Get user's wallet
 */
export async function getUserWallet(userId: string): Promise<UserWallet> {
  const { data, error } = await supabase
    .from('user_wallets')
    .select('id, user_id, balance, currency')
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Wallet doesn't exist, create it
      const { data: newWallet, error: createError } = await supabase
        .from('user_wallets')
        .insert({ user_id: userId })
        .select()
        .single()

      if (createError) throw createError
      return newWallet
    }
    throw error
  }

  return data
}

/**
 * Add balance to wallet
 */
export async function addWalletBalance(
  userId: string,
  amount: number,
  description: string
) {
  const wallet = await getUserWallet(userId)

  // Record transaction
  const { error: txError } = await supabase.from('wallet_transactions').insert({
    wallet_id: wallet.id,
    transaction_type: 'credit',
    amount,
    description,
    status: 'completed'
  })

  if (txError) throw txError

  // Update balance
  const { data, error } = await supabase
    .from('user_wallets')
    .update({
      balance: wallet.balance + amount,
      last_updated_at: new Date()
    })
    .eq('id', wallet.id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Deduct from wallet (for featured boost, etc)
 */
export async function deductWalletBalance(
  userId: string,
  amount: number,
  description: string
) {
  const wallet = await getUserWallet(userId)

  if (wallet.balance < amount) {
    throw new Error('Insufficient wallet balance')
  }

  // Record transaction
  const { error: txError } = await supabase.from('wallet_transactions').insert({
    wallet_id: wallet.id,
    transaction_type: 'debit',
    amount,
    description,
    status: 'completed'
  })

  if (txError) throw txError

  // Update balance
  const { data, error } = await supabase
    .from('user_wallets')
    .update({
      balance: wallet.balance - amount,
      total_spent: wallet.balance - amount,
      last_updated_at: new Date()
    })
    .eq('id', wallet.id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get wallet transaction history
 */
export async function getWalletTransactions(
  userId: string,
  limit: number = 50
) {
  const { data: wallet } = await getUserWallet(userId)

  const { data, error } = await supabase
    .from('wallet_transactions')
    .select('id, transaction_type, amount, description, created_at, status')
    .eq('wallet_id', wallet.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

/**
 * Create Stripe checkout session for featured boost
 */
export async function createFeaturedBoostCheckout(
  userId: string,
  adId: string,
  amount: number
) {
  const { data: user } = await supabase.from('users').select('email').eq('id', userId).single()

  if (!user?.email) throw new Error('User not found')

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'aed',
          product_data: {
            name: 'Featured Listing Boost (7 days)',
            description: `Boost ad ${adId}`
          },
          unit_amount: Math.round(amount * 100)
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/ads/${adId}?boost=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/ads/${adId}?boost=cancelled`,
    customer_email: user.email,
    metadata: {
      userId,
      adId,
      type: 'featured_boost'
    }
  })

  return session
}

/**
 * Create Stripe checkout for subscription
 */
export async function createSubscriptionCheckout(
  userId: string,
  planId: string
) {
  const { data: user } = await supabase.from('users').select('email').eq('id', userId).single()
  const { data: plan } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('id', planId)
    .single()

  if (!user?.email || !plan) throw new Error('Invalid user or plan')

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'aed',
          product_data: {
            name: plan.plan_name,
            description: `${plan.max_ads} ads, ${plan.max_featured_ads} featured ads`
          },
          unit_amount: Math.round(plan.price * 100)
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?subscription=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?subscription=cancelled`,
    customer_email: user.email,
    metadata: {
      userId,
      planId,
      type: 'subscription'
    }
  })

  return session
}

/**
 * Handle successful Stripe payment
 */
export async function handleSuccessfulPayment(
  sessionId: string,
  type: 'featured_boost' | 'subscription'
) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  const { userId, adId, planId } = session.metadata as any

  if (type === 'featured_boost') {
    // Make ad featured
    const { error } = await supabase
      .from('ads')
      .update({
        is_featured: true,
        featured_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      })
      .eq('id', adId)

    if (error) throw error

    // Record transaction
    await addWalletBalance(userId, -10, `Featured boost for ad ${adId}`)
  } else if (type === 'subscription') {
    // Update subscription
    const { error } = await supabase
      .from('users')
      .update({
        subscription_plan: planId,
        subscription_status: 'active',
        subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      })
      .eq('id', userId)

    if (error) throw error
  }

  return { success: true }
}
