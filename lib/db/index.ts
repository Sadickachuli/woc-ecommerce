import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'
import * as schema from './schema'

// Create the database connection
export const db = drizzle(sql, { schema })

// Export schema for easy access
export { schema }

// Export types
export type { Product, Order, OrderItem, NewProduct, NewOrder, NewOrderItem } from './schema'