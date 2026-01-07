import { getTasks, createTask } from "@/lib/tasks"
import { verifySession } from "@/lib/session"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tasks = await getTasks(session.userId)
    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("[v0] Error fetching tasks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, priority, due_date } = body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const task = await createTask(session.userId, title, description, priority, due_date)
    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
