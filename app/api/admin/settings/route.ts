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

  try {
    const { data, error } = await supabase
      .from('website_settings')
      .select('setting_key, setting_value, setting_type, description')

    if (error) throw error

    const settings = Object.fromEntries(
      data.map(s => [s.setting_key, { value: s.setting_value, type: s.setting_type }])
    )

    return NextResponse.json(settings)
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
    const { settingKey, settingValue } = await request.json()

    const { data, error } = await supabase
      .from('website_settings')
      .update({ setting_value: settingValue, updated_at: new Date() })
      .eq('setting_key', settingKey)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
