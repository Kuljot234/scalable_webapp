"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { Task } from "@/lib/tasks"

interface TaskCardProps {
  task: Task
  onTaskUpdated?: () => void
  onTaskDeleted?: () => void
}

const statusColors = {
  todo: "bg-slate-200 text-slate-800",
  "in-progress": "bg-blue-200 text-blue-800",
  done: "bg-green-200 text-green-800",
}

const priorityColors = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
}

export function TaskCard({ task, onTaskUpdated, onTaskDeleted }: TaskCardProps) {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update task")

      toast({
        title: "Success",
        description: "Task updated",
      })
      onTaskUpdated?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete task")

      toast({
        title: "Success",
        description: "Task deleted",
      })
      onTaskDeleted?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <div className="flex gap-1">
            <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>{task.priority}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {task.description && <p className="text-sm text-slate-600">{task.description}</p>}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Status:</span>
          <Select value={task.status} onValueChange={handleStatusChange} disabled={isUpdating}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {task.due_date && <p className="text-sm text-slate-600">Due: {new Date(task.due_date).toLocaleDateString()}</p>}
        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
