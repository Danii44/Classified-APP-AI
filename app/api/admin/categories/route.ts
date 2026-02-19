import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function checkAdminPermission(userId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', userId)
    .single()

  return data?.role === 'superadmin'
}

export async function GET(request: Request) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const isAdmin = await checkAdminPermission(user.id)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*, category_attributes(*)')
      .order('display_order')

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

  const isAdmin = await checkAdminPermission(user.id)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { categoryName, slug, icon, description, parentId } = await request.json()

    const { data, error } = await supabase
      .from('categories')
      .insert({
        category_name: categoryName,
        slug,
        icon,
        description,
        parent_category_id: parentId || null
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const isAdmin = await checkAdminPermission(user.id)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id, categoryName, slug, icon, description, isActive } = await request.json()

    const { data, error } = await supabase
      .from('categories')
      .update({
        category_name: categoryName,
        slug,
        icon,
        description,
        is_active: isActive
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
