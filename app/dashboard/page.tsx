"use client"

import { Card } from "@/components/ui/card"
import { ResponsivePie } from "@nivo/pie"
import { useSession } from "next-auth/react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Skeleton } from "@/components/ui/skeleton"

// Generate random HSL color
const randomColor = () => `hsl(${Math.random() * 360}, 70%, 50%)`

// Mock data - replace with real data
const monthlyData = [
  { month: "Jan", value: 400 },
  { month: "Feb", value: 300 },
  { month: "Mar", value: 200 },
  { month: "Apr", value: 278 },
  { month: "May", value: 189 },
  { month: "Jun", value: 239 },
  { month: "Jul", value: 349 },
  { month: "Aug", value: 430 },
  { month: "Sep", value: 291 },
  { month: "Oct", value: 500 },
  { month: "Nov", value: 378 },
  { month: "Dec", value: 390 },
]

const dailyPieData = [
  { id: "Transport", value: 40, color: randomColor() },
  { id: "Energy", value: 30, color: randomColor() },
  { id: "Waste", value: 20, color: randomColor() },
  { id: "Other", value: 10, color: randomColor() },
]

const monthlyPieData = [
  { id: "Transport", value: 35, color: randomColor() },
  { id: "Energy", value: 40, color: randomColor() },
  { id: "Waste", value: 15, color: randomColor() },
  { id: "Other", value: 10, color: randomColor() },
]

export default function DashboardPage() {
  const { data: session } = useSession()
  const companyName = session?.user?.name ?? "Guest"
  const isLoading = false // Replace with actual loading state

  const performanceChange = 15
  const environmentPoints = 26

  return (
    <div className="min-h-screen-navbar flex flex-col lg:flex-row gap-8">
      {/* Left Section - Company Info */}
      <div className="lg:w-1/3 space-y-12 p-4">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold">Hello,</h1>
          {isLoading ? (
            <Skeleton className="h-10 w-48" />
          ) : (
            <h2 className="text-4xl font-semibold text-forest">{companyName}</h2>
          )}
        </div>

        <div className="space-y-8">
          {isLoading ? (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold">
                  {Math.abs(performanceChange)}%
                </span>
                <span className={`text-xl ${performanceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {performanceChange > 0 ? 'better' : 'worse'} than last month
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold text-forest">
                  {environmentPoints}
                </span>
                <span className="text-xl text-forest">
                  environment points
                  <span className="text-green-600 block">
                    (+{environmentPoints} last month)
                  </span>
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Section - Charts */}
      <div className="lg:w-2/3 flex flex-col gap-8 p-4">
        {/* Pie Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            <>
              <Skeleton className="h-[300px]" />
              <Skeleton className="h-[300px]" />
            </>
          ) : (
            <>
              <Card className="p-6 border-none bg-background/50 shadow-none">
                <h2 className="text-xl font-semibold mb-4">Daily Carbon Footprint</h2>
                <div className="h-[200px]">
                  <ResponsivePie
                    data={dailyPieData}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    colors={{ datum: 'data.color' }}
                    enableArcLinkLabels={true}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLinkLabelsThickness={2}
                  />
                </div>
              </Card>

              <Card className="p-6 border-none bg-background/50 shadow-none">
                <h2 className="text-xl font-semibold mb-4">Monthly Carbon Footprint</h2>
                <div className="h-[200px]">
                  <ResponsivePie
                    data={monthlyPieData}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    colors={{ datum: 'data.color' }}
                    enableArcLinkLabels={true}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLinkLabelsThickness={2}
                  />
                </div>
              </Card>
            </>
          )}
        </div>

        {/* Line Chart */}
        {isLoading ? (
          <Skeleton className="h-[300px]" />
        ) : (
          <Card className="p-6 border-none bg-background/50 shadow-none">
            <h2 className="text-xl font-semibold mb-4">Yearly Carbon Footprint Trend</h2>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={randomColor()}
                    strokeWidth={2}
                    dot={{ strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}