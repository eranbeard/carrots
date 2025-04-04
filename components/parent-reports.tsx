"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Calendar, Clock, CheckCircle } from "lucide-react"
import type { Task } from "@/components/task-card"

interface ReportData {
  childId: string
  childName: string
  tasksCompleted: number
  timeEarned: number
  timeUsed: number
  tasks: Task[]
}

interface ParentReportsProps {
  dailyReports: ReportData[]
  weeklyReports: ReportData[]
}

export function ParentReports({ dailyReports, weeklyReports }: ParentReportsProps) {
  const [reportType, setReportType] = useState<"daily" | "weekly">("daily")
  const [selectedChildId, setSelectedChildId] = useState<string | null>(
    dailyReports.length > 0 ? dailyReports[0].childId : null,
  )

  const reports = reportType === "daily" ? dailyReports : weeklyReports
  const selectedReport = reports.find((report) => report.childId === selectedChildId) || reports[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart className="mr-2 h-5 w-5 text-orange-500" />
          Activity Reports
        </CardTitle>
        <CardDescription>Track your children's task completion and game time usage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={reportType} onValueChange={(value) => setReportType(value as "daily" | "weekly")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Weekly
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {reports.length > 0 ? (
          <>
            {reports.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {reports.map((report) => (
                  <button
                    key={report.childId}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                      selectedChildId === report.childId
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedChildId(report.childId)}
                  >
                    {report.childName}
                  </button>
                ))}
              </div>
            )}

            {selectedReport && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-orange-50 rounded-lg p-3 flex flex-col items-center">
                    <CheckCircle className="h-5 w-5 text-orange-500 mb-1" />
                    <div className="text-xl font-bold">{selectedReport.tasksCompleted}</div>
                    <div className="text-xs text-gray-500">Tasks Completed</div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3 flex flex-col items-center">
                    <Clock className="h-5 w-5 text-green-500 mb-1" />
                    <div className="text-xl font-bold">{selectedReport.timeEarned}</div>
                    <div className="text-xs text-gray-500">Minutes Earned</div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center">
                    <Clock className="h-5 w-5 text-blue-500 mb-1" />
                    <div className="text-xl font-bold">{selectedReport.timeUsed}</div>
                    <div className="text-xs text-gray-500">Minutes Used</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Recent Tasks</h3>
                  <div className="space-y-2">
                    {selectedReport.tasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(task.completedAt || task.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            task.status === "approved"
                              ? "text-green-500"
                              : task.status === "rejected"
                                ? "text-red-500"
                                : "text-orange-500"
                          }`}
                        >
                          {task.type === "time"
                            ? `${Math.floor((task.timeSpent || 0) / 60)} min`
                            : `${task.creditMinutes} min`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">No report data available yet</div>
        )}
      </CardContent>
    </Card>
  )
}

