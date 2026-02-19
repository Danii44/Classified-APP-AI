import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parentId')

    let query = supabase
      .from('categories')
      .select('id, category_name, slug, icon, description, parent_category_id')
      .eq('is_active', true)
      .order('display_order')

    if (parentId) {
      query = query.eq('parent_category_id', parentId)
    } else {
      query = query.is('parent_category_id', null)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
