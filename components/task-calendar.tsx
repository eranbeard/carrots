"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import type { Task } from "@/components/task-card"

interface TaskCalendarProps {
  tasks: Task[]
  onSelectDate: (date: Date) => void
}

export function TaskCalendar({ tasks, onSelectDate }: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<Date[]>([])

  // Generate calendar days for the current month
  useEffect(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Get the first day of the month
    const firstDay = new Date(year, month, 1)
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay()

    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek
    const prevMonthLastDay = new Date(year, month, 0).getDate()

    const days: Date[] = []

    // Add days from previous month
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthLastDay - i))
    }

    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    // Add days from next month to complete the grid (6 rows x 7 days = 42 cells)
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i))
    }

    setCalendarDays(days)
  }, [currentDate])

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
    onSelectDate(date)
  }

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.createdAt)
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      )
    })
  }

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Check if a date is selected
  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  // Check if a date is in the current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  // Format date for display
  const formatMonth = (date: Date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" })
  }

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5 text-orange-500" />
            Tasks Calendar
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{formatMonth(currentDate)}</span>
            <Button variant="ghost" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {/* Day names */}
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((date, index) => {
            const tasksForDate = getTasksForDate(date)
            const hasCompletedTasks = tasksForDate.some(
              (task) => task.status === "completed" || task.status === "approved",
            )

            return (
              <button
                key={index}
                className={`
                  relative h-10 rounded-md text-sm p-1
                  ${isSelected(date) ? "bg-orange-500 text-white" : ""}
                  ${isToday(date) && !isSelected(date) ? "bg-orange-100 text-orange-800" : ""}
                  ${!isCurrentMonth(date) ? "text-gray-400" : ""}
                  ${!isSelected(date) && !isToday(date) ? "hover:bg-gray-100" : ""}
                `}
                onClick={() => handleSelectDate(date)}
              >
                <span>{date.getDate()}</span>

                {/* Task indicator */}
                {tasksForDate.length > 0 && (
                  <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                    <div
                      className={`
                      h-1.5 w-1.5 rounded-full
                      ${hasCompletedTasks ? "bg-green-500" : "bg-orange-500"}
                      ${isSelected(date) ? "bg-white" : ""}
                    `}
                    />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Tasks for selected date */}
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Tasks for {selectedDate.toLocaleDateString()}</h3>

          <div className="space-y-2">
            {getTasksForDate(selectedDate).length > 0 ? (
              getTasksForDate(selectedDate).map((task) => (
                <div
                  key={task.id}
                  className={`
                    p-2 rounded-md text-sm
                    ${
                      task.status === "approved"
                        ? "bg-green-50 border border-green-200"
                        : task.status === "completed"
                          ? "bg-orange-50 border border-orange-200"
                          : "bg-gray-50 border border-gray-200"
                    }
                  `}
                >
                  <div className="font-medium">{task.title}</div>
                  {task.description && <div className="text-xs text-gray-500">{task.description}</div>}
                  <div className="text-xs mt-1 flex justify-between">
                    <span>{task.type === "time" ? "Time-based" : `${task.creditMinutes} min`}</span>
                    <span
                      className={`
                      font-medium
                      ${
                        task.status === "approved"
                          ? "text-green-600"
                          : task.status === "completed"
                            ? "text-orange-600"
                            : task.status === "rejected"
                              ? "text-red-600"
                              : "text-gray-600"
                      }
                    `}
                    >
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-gray-500">No tasks for this date</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

