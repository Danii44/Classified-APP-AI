import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('id, rating, comment, reviewer_id, created_at, cleanliness_rating, accuracy_rating, communication_rating')
      .eq('reviewed_user_id', userId)
      .order('created_at', { ascending: false })

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

  try {
    const {
      reviewedUserId,
      adId,
      rating,
      comment,
      cleanlinessRating,
      accuracyRating,
      communicationRating
    } = await request.json()

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        reviewer_id: user.id,
        reviewed_user_id: reviewedUserId,
        ad_id: adId,
        rating,
        comment,
        cleanliness_rating: cleanlinessRating,
        accuracy_rating: accuracyRating,
        communication_rating: communicationRating
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
