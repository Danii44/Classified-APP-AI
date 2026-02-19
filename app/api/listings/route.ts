import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const supabase = createClient()

  const countryId = searchParams.get('countryId')
  const categoryId = searchParams.get('categoryId')
  const priceMin = searchParams.get('priceMin')
  const priceMax = searchParams.get('priceMax')
  const search = searchParams.get('search')
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20

  try {
    let query = supabase
      .from('ads')
      .select('*, ad_images(*), users(first_name, last_name, avatar_url)')
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (countryId) {
      query = query.eq('country', countryId)
    }
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }
    if (priceMin) {
      query = query.gte('price', parseFloat(priceMin))
    }
    if (priceMax) {
      query = query.lte('price', parseFloat(priceMax))
    }
    if (search) {
      query = query.ilike('title', `%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('[API] Listings error:', error)
      return NextResponse.json({ error: error.message, data: [] }, { status: 200 })
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error('[API] Listings exception:', error)
    return NextResponse.json({ error: error.message, data: [] }, { status: 200 })
  }
}
