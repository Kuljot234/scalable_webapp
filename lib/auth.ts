import bcrypt from "bcryptjs"
import { sql } from "./db"

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function getUserByEmail(email: string) {
  const result = await sql`SELECT * FROM users WHERE email = ${email}`
  return result[0] || null
}

export async function createUser(email: string, passwordHash: string, name: string) {
  const result = await sql`
    INSERT INTO users (email, password_hash, name)
    VALUES (${email}, ${passwordHash}, ${name})
    RETURNING id, email, name, created_at
  `
  return result[0]
}

export async function getUserById(id: number) {
  const result = await sql`SELECT id, email, name, created_at FROM users WHERE id = ${id}`
  return result[0] || null
}
