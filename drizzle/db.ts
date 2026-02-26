// Connecting Drizzle ORM with Supabase (PostgreSQL via Transaction Pooler)
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

// `prepare: false` is required for Supabase Transaction Pooler (port 6543)
// in serverless environments like Vercel — pooler doesn't support prepared statements
const client = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db = drizzle(client);
