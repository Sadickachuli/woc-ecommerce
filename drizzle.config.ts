import type { Config } from 'drizzle-kit'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgres://neondb_owner:npg_BO8novI6EJwr@ep-damp-tree-adevntf9-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  },
} satisfies Config