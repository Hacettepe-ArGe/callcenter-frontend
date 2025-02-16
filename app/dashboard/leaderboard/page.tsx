"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, Medal } from "lucide-react"
import { cn } from "@/lib/utils"

interface LeaderboardEntry {
  company: string
  totalCarbon: number
}

export default function LeaderboardPage() {
  const { data: session } = useSession()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!session?.user?.token) return

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/leaderboard`, {
          headers: {
            'Authorization': `Bearer ${session.user.token}`,
            'Content-Type': 'application/json',
          }
        })

        if (!response.ok) throw new Error('Failed to fetch leaderboard')

        const data = await response.json()
        setLeaderboard(data.sort((a: LeaderboardEntry, b: LeaderboardEntry) => a.totalCarbon - b.totalCarbon))
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [session?.user?.token])

  const getRankStyles = (index: number) => {
    switch (index) {
      case 0:
        return {
          background: "bg-yellow-500",
          text: "text-yellow-700",
          icon: <Trophy className="h-6 w-6 text-yellow-700" />
        }
      case 1:
        return {
          background: "bg-gray-300",
          text: "text-gray-700",
          icon: <Medal className="h-6 w-6 text-gray-700" />
        }
      case 2:
        return {
          background: "bg-amber-600",
          text: "text-amber-800",
          icon: <Medal className="h-6 w-6 text-amber-800" />
        }
      default:
        return {
          background: "bg-white",
          text: "text-gray-600",
          icon: null
        }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Leaderboard</h1>
        <p className="text-muted-foreground">Companies ranked by carbon emissions</p>
      </div>

      <div className="grid gap-4">
        {leaderboard.map((entry, index) => {
          const styles = getRankStyles(index)
          
          return (
            <Card
              key={entry.company}
              className={cn(
                "p-4 transition-all hover:scale-[1.01]",
                styles.background,
                index < 3 ? "bg-opacity-20" : ""
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8">
                    {styles.icon || <span className={cn("font-bold", styles.text)}>#{index + 1}</span>}
                  </div>
                  <div>
                    <p className="font-semibold">{entry.company}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.totalCarbon.toLocaleString()} kg CO₂e
                    </p>
                  </div>
                </div>
                  {entry.company === session?.user?.name && (
                  <span className="text-xs bg-forest/10 text-forest px-2 py-1 rounded-full">
                    You
                  </span>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 