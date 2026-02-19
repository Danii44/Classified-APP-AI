import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const categoryId = formData.get('categoryId') as string
    const price = parseFloat(formData.get('price') as string)
    const condition = formData.get('condition') as string
    const city = formData.get('city') as string
    const currencyCode = formData.get('currencyCode') || 'AED'
    const images = formData.getAll('images') as File[]

    if (!title || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        seller_id: user.id,
        title,
        description,
        category_id: categoryId,
        price,
        currency_code: currencyCode,
        condition,
        city,
        country_code: 'AE',
      })
      .select()
      .single()

    if (productError) {
      return NextResponse.json(
        { error: productError.message },
        { status: 400 }
      )
    }

    // Upload images if provided
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const file = images[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${product.id}/${Date.now()}_${i}.${fileExt}`
        const filePath = `products/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('nexus-market-uploads')
          .upload(filePath, file)

        if (!uploadError) {
          const { data } = supabase.storage
            .from('nexus-market-uploads')
            .getPublicUrl(filePath)

          await supabase
            .from('product_images')
            .insert({
              product_id: product.id,
              image_url: data.publicUrl,
              image_path: filePath,
              display_order: i,
              uploaded_by: user.id,
            })
        }
      }
    }

    return NextResponse.json({ product, success: true })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
