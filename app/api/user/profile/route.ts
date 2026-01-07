import { sql } from "@/lib/db"
import { verifySession } from "@/lib/session"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const result = await sql`
      UPDATE users
      SET name = ${name}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${session.userId}
      RETURNING id, email, name, created_at
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: result[0] })
  } catch (error) {
    console.error("[v0] Error updating profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
