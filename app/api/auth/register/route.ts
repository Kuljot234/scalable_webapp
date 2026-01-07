import { createUser, hashPassword, getUserByEmail } from "@/lib/auth"
import { createSession } from "@/lib/session"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)
    const user = await createUser(email, passwordHash, name)

    await createSession(user.id, user.email)

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } }, { status: 201 })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
