"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { TaskForm } from "./task-form"
import { TaskCard } from "./task-card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"
import type { Task } from "@/lib/tasks"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function TaskDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const { data, isLoading, error, mutate } = useSWR<{ tasks: Task[] }>("/api/tasks", fetcher)

  useEffect(() => {
    if (error) {
      if (error.status === 401) {
        router.push("/auth/login")
      } else {
        toast({
          title: "Error",
          description: "Failed to load tasks",
          variant: "destructive",
        })
      }
    }
  }, [error, router, toast])

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  const tasks = data?.tasks || []
  const todoTasks = tasks.filter((t) => t.status === "todo")
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress")
  const doneTasks = tasks.filter((t) => t.status === "done")

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Task Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <TaskForm onTaskCreated={() => mutate()} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Todo Column */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-slate-900">To Do ({todoTasks.length})</h2>
            <div className="space-y-3">
              {todoTasks.length === 0 ? (
                <p className="text-sm text-slate-500">No tasks</p>
              ) : (
                todoTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onTaskUpdated={() => mutate()} onTaskDeleted={() => mutate()} />
                ))
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-slate-900">In Progress ({inProgressTasks.length})</h2>
            <div className="space-y-3">
              {inProgressTasks.length === 0 ? (
                <p className="text-sm text-slate-500">No tasks</p>
              ) : (
                inProgressTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onTaskUpdated={() => mutate()} onTaskDeleted={() => mutate()} />
                ))
              )}
            </div>
          </div>

          {/* Done Column */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-slate-900">Done ({doneTasks.length})</h2>
            <div className="space-y-3">
              {doneTasks.length === 0 ? (
                <p className="text-sm text-slate-500">No tasks</p>
              ) : (
                doneTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onTaskUpdated={() => mutate()} onTaskDeleted={() => mutate()} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
