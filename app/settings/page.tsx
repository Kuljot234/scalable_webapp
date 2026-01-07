"use client"
import { useRouter } from "next/navigation"
import { UserProfile } from "@/components/user-profile"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/auth/login")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <UserProfile />

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">Account deletion cannot be undone.</p>
            <Button variant="destructive" disabled>
              Delete Account (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
