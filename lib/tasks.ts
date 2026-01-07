import { sql } from "./db"

export interface Task {
  id: number
  user_id: number
  title: string
  description?: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  due_date?: string
  created_at: string
  updated_at: string
}

export async function getTasks(userId: number) {
  const result = await sql`SELECT * FROM tasks WHERE user_id = ${userId} ORDER BY created_at DESC`
  return result as Task[]
}

export async function getTaskById(id: number, userId: number) {
  const result = await sql`SELECT * FROM tasks WHERE id = ${id} AND user_id = ${userId}`
  return result[0] as Task | undefined
}

export async function createTask(
  userId: number,
  title: string,
  description?: string,
  priority?: string,
  due_date?: string,
) {
  const result = await sql`
    INSERT INTO tasks (user_id, title, description, priority, due_date, status)
    VALUES (${userId}, ${title}, ${description || null}, ${priority || "medium"}, ${due_date || null}, 'todo')
    RETURNING *
  `
  return result[0] as Task
}

export async function updateTask(
  id: number,
  userId: number,
  updates: {
    title?: string
    description?: string
    status?: string
    priority?: string
    due_date?: string
  },
) {
  const { title, description, status, priority, due_date } = updates

  const result = await sql`
    UPDATE tasks
    SET
      title = COALESCE(${title || null}, title),
      description = COALESCE(${description || null}, description),
      status = COALESCE(${status || null}, status),
      priority = COALESCE(${priority || null}, priority),
      due_date = COALESCE(${due_date || null}, due_date),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING *
  `
  return result[0] as Task | undefined
}

export async function deleteTask(id: number, userId: number) {
  await sql`DELETE FROM tasks WHERE id = ${id} AND user_id = ${userId}`
  return true
}
