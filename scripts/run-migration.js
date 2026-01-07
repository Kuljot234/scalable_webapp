import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

async function runMigration() {
  try {
    console.log("[v0] Starting database migration...")

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("[v0] Users table created")

    // Create tasks table
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'todo',
        priority VARCHAR(50) DEFAULT 'medium',
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("[v0] Tasks table created")

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`
    console.log("[v0] Indexes created")

    console.log("[v0] Migration completed successfully!")
  } catch (error) {
    console.error("[v0] Migration failed:", error)
    process.exit(1)
  }
}

runMigration()
