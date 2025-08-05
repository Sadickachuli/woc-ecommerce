import { NextRequest, NextResponse } from 'next/server'
import { products, addProduct, updateProduct, deleteProduct } from '../../lib/data'

export async function GET() {
  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, image, category, stock } = body

    // Validate required fields
    if (!name || !description || !price || !category || stock === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create product
    const product = addProduct({
      name,
      description,
      price: parseFloat(price),
      image: image || '/images/default-product.jpg',
      category,
      stock: parseInt(stock)
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const updatedProduct = updateProduct(id, updates)
    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedProduct)
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
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const success = deleteProduct(id)
    if (!success) {
      return NextResponse.json(
        { error: 'Product not found' },
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