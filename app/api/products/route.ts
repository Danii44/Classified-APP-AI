import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    const city = searchParams.get('city')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = supabase
      .from('products')
      .select(
        `*,
        categories:category_id(id, name, slug),
        profiles:seller_id(id, first_name, last_name, rating, verified),
        product_images(image_url, display_order)`
      )
      .eq('status', 'active')
      .order(sortBy, { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (category) {
      query = query.eq('category_id', category)
    }

    if (city) {
      query = query.eq('city', city)
    }

    if (priceMin) {
      query = query.gte('price', parseFloat(priceMin))
    }

    if (priceMax) {
      query = query.lte('price', parseFloat(priceMax))
    }

    const { data: products, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      products,
      page,
      limit,
      total: products?.length || 0,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
