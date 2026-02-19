import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('id, sender_id, content, created_at, is_read')
      .eq('conversation_id', params.id)
      .order('created_at', { ascending: true })

    if (error) throw error

    // Mark as read
    await supabase
      .from('messages')
      .update({ is_read: true, read_at: new Date() })
      .eq('conversation_id', params.id)
      .neq('sender_id', user.id)

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { content } = await request.json()

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: params.id,
        sender_id: user.id,
        content
      })
      .select()
      .single()

    if (error) throw error

    // Update conversation last message time
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date() })
      .eq('id', params.id)

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
