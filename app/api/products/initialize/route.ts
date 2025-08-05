import { NextResponse } from 'next/server'
import { initializeDatabase } from '../../../../lib/db/operations'

export async function POST() {
  try {
    console.log('Manual database initialization requested')
    await initializeDatabase()
    return NextResponse.json({ message: 'Database initialized successfully' })
  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    )
  }
}