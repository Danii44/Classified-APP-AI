import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getUserListings } from '@/lib/db'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const listings = await getUserListings(id)
    return NextResponse.json(listings)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
