import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-min-32-chars-long-!!!!")

export async function createSession(userId: number, email: string) {
  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(JWT_SECRET)

  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  return token
}

export async function verifySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) return null

  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload as { userId: number; email: string }
  } catch (err) {
    return null
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.set("session", "", { maxAge: 0 })
}
