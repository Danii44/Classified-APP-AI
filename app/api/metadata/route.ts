import { NextResponse } from 'next/server'
import { getCountries, getCategories, getCategoryAttributes } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  try {
    if (type === 'countries') {
      const data = await getCountries()
      return NextResponse.json(data)
    }
    if (type === 'categories') {
      const data = await getCategories()
      return NextResponse.json(data)
    }
    if (type === 'attributes') {
      const categoryId = searchParams.get('categoryId')
      if (!categoryId) {
        return NextResponse.json({ error: 'categoryId required' }, { status: 400 })
      }
      const data = await getCategoryAttributes(categoryId)
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error: any) {
    console.error('[API] Metadata error:', error.message)
    // Return empty array instead of error to prevent frontend crashes
    if (type === 'countries' || type === 'categories') {
      return NextResponse.json([])
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
