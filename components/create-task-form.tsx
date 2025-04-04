"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Clock, CheckCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CreateTaskFormProps {
  onCreateTask: (task: {
    title: string
    description: string
    type: "time" | "credit"
    creditMinutes?: number
    childId?: string
  }) => Promise<void>
  children: { id: string; name: string }[]
  onCancel?: () => void
}

export function CreateTaskForm({ onCreateTask, children, onCancel }: CreateTaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [taskType, setTaskType] = useState<"time" | "credit">("time")
  const [creditMinutes, setCreditMinutes] = useState(10)
  const [selectedChildId, setSelectedChildId] = useState(children.length > 0 ? children[0].id : "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title) {
      toast({
        title: "Missing information",
        description: "Please provide a task title",
        variant: "destructive",
      })
      return
    }

    if (taskType === "credit" && (!creditMinutes || creditMinutes <= 0)) {
      toast({
        title: "Invalid minutes",
        description: "Please provide a valid number of minutes",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await onCreateTask({
        title,
        description,
        type: taskType,
        creditMinutes: taskType === "credit" ? creditMinutes : undefined,
        childId: selectedChildId || undefined,
      })

      // Reset form
      setTitle("")
      setDescription("")
      setTaskType("time")
      setCreditMinutes(10)

      toast({
        title: "Task created",
        description: "The task has been created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating the task",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Read a book, Clean your room"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about the task..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Task Type</Label>
        <RadioGroup
          value={taskType}
          onValueChange={(value) => setTaskType(value as "time" | "credit")}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-start space-x-2 rounded-md border p-3">
            <RadioGroupItem value="time" id="time" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="time" className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-blue-500" />
                Time-based Task
              </Label>
              <p className="text-sm text-gray-500">Child earns game time equal to the time spent on the task</p>
            </div>
          </div>

          <div className="flex items-start space-x-2 rounded-md border p-3">
            <RadioGroupItem value="credit" id="credit" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="credit" className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-orange-500" />
                Credit-based Task
              </Label>
              <p className="text-sm text-gray-500">Child earns a fixed amount of game time for completing the task</p>

              {taskType === "credit" && (
                <div className="mt-2 flex items-center space-x-2">
                  <Input
                    type="number"
                    min={1}
                    value={creditMinutes}
                    onChange={(e) => setCreditMinutes(Number.parseInt(e.target.value) || 0)}
                    className="w-20"
                  />
                  <span className="text-sm">minutes</span>
                </div>
              )}
            </div>
          </div>
        </RadioGroup>
      </div>

      {children.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="childId">Assign to</Label>
          <select
            id="childId"
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Task"
          )}
        </Button>
      </div>
    </form>
  )
}

