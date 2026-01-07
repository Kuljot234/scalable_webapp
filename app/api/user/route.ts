import { getUserById } from "@/lib/auth"
import { verifySession } from "@/lib/session"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserById(session.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("[v0] Error fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
