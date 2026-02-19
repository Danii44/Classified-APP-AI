import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (!data) {
      const { data: newWallet } = await supabase
        .from('user_wallets')
        .insert({ user_id: userId })
        .select()
        .single()

      return NextResponse.json(newWallet)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching wallet:', error)
    return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { amount, description, type } = await request.json()

    const { data: wallet } = await supabase
      .from('user_wallets')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!wallet) throw new Error('Wallet not found')

    const newBalance = type === 'credit' ? amount : -amount

    const { error } = await supabase.from('wallet_transactions').insert({
      wallet_id: wallet.id,
      transaction_type: type,
      amount,
      description,
      status: 'completed'
    })

    if (error) throw error

    const { data: updated } = await supabase
      .from('user_wallets')
      .update({
        balance: supabase.rpc('balance_change', { delta: newBalance }),
        last_updated_at: new Date()
      })
      .eq('user_id', userId)
      .select()
      .single()

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating wallet:', error)
    return NextResponse.json({ error: 'Failed to update wallet' }, { status: 500 })
  }
}
