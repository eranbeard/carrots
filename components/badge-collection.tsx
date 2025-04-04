"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Book, Brush, Clock, Star, Award } from "lucide-react"
import { motion } from "framer-motion"

export interface Badge {
  id: string
  title: string
  description: string
  icon: "trophy" | "book" | "brush" | "clock" | "star" | "award"
  category: "achievement" | "skill" | "streak"
  achieved: boolean
  progress?: number
  total?: number
  date?: string
}

interface BadgeCollectionProps {
  badges: Badge[]
}

export function BadgeCollection({ badges }: BadgeCollectionProps) {
  const [activeTab, setActiveTab] = useState<string>("all")

  const getIcon = (icon: Badge["icon"], achieved: boolean) => {
    const className = `h-6 w-6 ${achieved ? "text-orange-500" : "text-gray-400"}`

    switch (icon) {
      case "trophy":
        return <Trophy className={className} />
      case "book":
        return <Book className={className} />
      case "brush":
        return <Brush className={className} />
      case "clock":
        return <Clock className={className} />
      case "star":
        return <Star className={className} />
      case "award":
        return <Award className={className} />
      default:
        return <Trophy className={className} />
    }
  }

  const filteredBadges = activeTab === "all" ? badges : badges.filter((badge) => badge.category === activeTab)

  const achievedCount = badges.filter((badge) => badge.achieved).length

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Badges & Achievements</CardTitle>
        <CardDescription>
          You've earned {achievedCount} out of {badges.length} badges
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="achievement">Achievements</TabsTrigger>
            <TabsTrigger value="skill">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredBadges.map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.05 }}
                  className={`relative flex flex-col items-center p-3 rounded-lg border ${
                    badge.achieved ? "border-orange-300 bg-orange-50" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className={`p-3 rounded-full mb-2 ${badge.achieved ? "bg-orange-100" : "bg-gray-100"}`}>
                    {getIcon(badge.icon, badge.achieved)}
                  </div>

                  <h3 className="text-sm font-medium text-center">{badge.title}</h3>

                  {badge.progress !== undefined && badge.total !== undefined && (
                    <div className="w-full mt-2">
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${(badge.progress / badge.total) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-center mt-1 text-gray-500">
                        {badge.progress}/{badge.total}
                      </div>
                    </div>
                  )}

                  {badge.achieved && badge.date && (
                    <div className="text-xs text-gray-500 mt-1">
                      Earned: {new Date(badge.date).toLocaleDateString()}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

