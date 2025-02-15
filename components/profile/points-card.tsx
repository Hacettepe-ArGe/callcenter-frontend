"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { 
  Leaf, 
  TrendingUp, 
  HeartHandshake, 
  AlertCircle,
  CheckCircle2,
  TreeDeciduous
} from "lucide-react"

const MINIMUM_POINTS = 100 // Minimum points needed to donate

export function PointsCard() {
  const { data: session } = useSession()
  const [donationAmount, setDonationAmount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  
  // Get total points from session (assuming it's stored in user.totalCarbon)
  const totalPoints = session?.user?.totalCarbon || 0
  const canDonate = totalPoints >= MINIMUM_POINTS

  const handleDonate = async () => {
    if (!canDonate || donationAmount > totalPoints) return

    try {
      setIsLoading(true)
      const res = await fetch("/api/points/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points: donationAmount }),
      })

      if (!res.ok) throw new Error("Failed to donate points")

      toast({
        title: "Points Donated",
        description: `Successfully donated ${donationAmount} points!`,
      })
      
      // Reset donation amount
      setDonationAmount(0)
      
      // You might want to refresh the session here to update the points
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to donate points. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <Leaf className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Carbon Points</h2>
            <p className="text-muted-foreground">Track and donate your carbon points</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-forest" />
              Progress to donation
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <TreeDeciduous className="h-4 w-4" />
              {totalPoints} / {MINIMUM_POINTS} points
            </span>
          </div>
          <Progress 
            value={(totalPoints / MINIMUM_POINTS) * 100} 
            className="bg-sage/20"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Amount to donate"
                min={0}
                max={totalPoints}
                value={donationAmount || ""}
                onChange={(e) => setDonationAmount(Number(e.target.value))}
                disabled={!canDonate || isLoading}
              />
            </div>
            <Button 
              onClick={handleDonate}
              disabled={!canDonate || donationAmount <= 0 || donationAmount > totalPoints || isLoading}
              className="flex items-center gap-2"
            >
              <HeartHandshake className="h-4 w-4" />
              {isLoading ? "Donating..." : "Donate Points"}
            </Button>
          </div>

          {!canDonate && (
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
              <span>
                You need at least {MINIMUM_POINTS} points to make a donation.
                Keep reducing your carbon footprint to earn more points!
              </span>
            </p>
          )}
          
          {canDonate && (
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-green-500" />
              <span>
                You can donate up to {totalPoints} points to support environmental projects.
              </span>
            </p>
          )}
        </div>
      </div>
    </Card>
  )
} 