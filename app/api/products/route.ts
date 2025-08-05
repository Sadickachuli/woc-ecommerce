import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, createProduct, updateProduct, deleteProduct, initializeDatabase } from '../../../lib/db/operations'

export async function GET() {
  try {
    const products = await getAllProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/products - Creating new product')
    const body = await request.json()
    console.log('Request body:', body)
    
    const { name, description, price, image, category, stock } = body

    // Validate required fields
    if (!name || !description || !price || !image || !category || stock === undefined) {
      console.log('Missing required fields:', { name, description, price, image, category, stock })
      return NextResponse.json(
        { error: 'Missing required fields', details: { name, description, price, image, category, stock } },
        { status: 400 }
      )
    }

    console.log('Creating product with data:', {
      name,
      description,
      price: price.toString(),
      image,
      category,
      stock: parseInt(stock),
    })

    const product = await createProduct({
      name,
      description,
      price: price.toString(),
      image,
      category,
      stock: parseInt(stock),
    })

    console.log('Product creation result:', product)

    if (!product) {
      console.error('createProduct returned null/undefined')
      return NextResponse.json(
        { error: 'Failed to create product - database operation failed' },
        { status: 500 }
      )
    }

    console.log('Product created successfully:', product.id)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product - full error:', error)
    return NextResponse.json(
      { error: 'Failed to create product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, price, image, category, stock } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = price.toString()
    if (image !== undefined) updateData.image = image
    if (category !== undefined) updateData.category = category
    if (stock !== undefined) updateData.stock = parseInt(stock)

    const product = await updateProduct(id, updateData)

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or failed to update' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const success = await deleteProduct(id)

    if (!success) {
      return NextResponse.json(
        { error: 'Product not found or failed to delete' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}