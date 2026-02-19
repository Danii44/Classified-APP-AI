import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createListing } from '@/lib/db'

export async function POST(request: Request) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const listingData = await request.json()

    const listing = await createListing({
      user_id: user.id,
      ...listingData,
    })

    return NextResponse.json(listing, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
