"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"

interface User {
  id: number
  email: string
  name: string
  created_at: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function UserProfile() {
  const { toast } = useToast()
  const { data, isLoading, error, mutate } = useSWR<{ user: User }>("/api/user", fetcher)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [name, setName] = useState("")

  useEffect(() => {
    if (data?.user) {
      setName(data.user.name)
    }
  }, [data])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) throw new Error("Failed to update profile")

      const result = await response.json()
      setName(result.user.name)
      setIsEditing(false)

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })

      mutate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    )
  }

  if (error || !data?.user) {
    return <div className="text-center text-red-600">Failed to load user profile</div>
  }

  const user = data.user

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Manage your account details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user.email} disabled className="bg-slate-50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          {isEditing ? (
            <div className="flex gap-2">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <Input value={name} disabled className="bg-slate-50" />
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label>Member Since</Label>
          <p className="text-sm text-slate-600">{new Date(user.created_at).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  )
}
