import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getSellerRating } from '@/lib/db'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const rating = await getSellerRating(id)
    return NextResponse.json(rating)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
