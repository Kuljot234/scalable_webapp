import { getUserByEmail, verifyPassword } from "@/lib/auth"
import { createSession } from "@/lib/session"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const passwordValid = await verifyPassword(password, user.password_hash)
    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    await createSession(user.id, user.email)

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
