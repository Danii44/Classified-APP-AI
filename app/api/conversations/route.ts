import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id,
        ad_id,
        buyer_id,
        seller_id,
        subject,
        last_message_at,
        ads(title, price),
        messages(count)
      `)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .eq('status', 'active')
      .order('last_message_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { adId, sellerId, subject } = await request.json()

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        ad_id: adId,
        buyer_id: user.id,
        seller_id: sellerId,
        subject: subject || 'Interested in your ad'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
