import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let query = supabase
      .from('ads')
      .select('id, title, price, currency, city, is_featured, created_at, ad_images(image_url)', { count: 'exact' })
      .eq('status', 'active')

    if (category) {
      query = query.eq('category_id', category)
    }

    if (city) {
      query = query.eq('city', city)
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice))
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice))
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching ads:', error)
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = request.headers.get('x-user-id')
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { title, description, categoryId, price, currency, city, condition, country, images } = await request.json()

    const { data: ad, error: adError } = await supabase
      .from('ads')
      .insert({
        user_id: session,
        category_id: categoryId,
        title,
        description,
        price,
        currency,
        city,
        country,
        condition,
        status: 'pending'
      })
      .select()
      .single()

    if (adError) throw adError

    if (images && images.length > 0) {
      const imageInserts = images.map((url: string, index: number) => ({
        ad_id: ad.id,
        image_url: url,
        image_order: index
      }))

      const { error: imgError } = await supabase.from('ad_images').insert(imageInserts)
      if (imgError) throw imgError
    }

    return NextResponse.json(ad, { status: 201 })
  } catch (error) {
    console.error('Error creating ad:', error)
    return NextResponse.json({ error: 'Failed to create ad' }, { status: 500 })
  }
}
