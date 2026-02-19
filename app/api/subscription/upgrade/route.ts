import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { planId } = await request.json()

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single()

    if (planError) throw planError

    // Call stored procedure to upgrade
    const { data, error } = await supabase.rpc('upgrade_subscription', {
      p_user_id: user.id,
      p_plan_id: planId,
      p_amount: plan.price
    })

    if (error) throw error

    return NextResponse.json({
      success: data[0]?.success,
      message: data[0]?.message,
      subscription: {
        plan: plan.plan_name,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
