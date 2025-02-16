"use client"

import { Card } from "@/components/ui/card"
import { ResponsivePie } from "@nivo/pie"
import { useSession } from "next-auth/react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { formatDate } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { cn } from "@/lib/utils"

interface DashboardData {
  daily: {
    breakdown: EmissionBreakdown[]
    date: string
  }
  monthly: {
    breakdown: EmissionBreakdown[]
    month: string
  }
  yearly: {
    monthlyData: {
      month: number
      electricity: number
      naturalGas: number
      vehicles: number
      waste: number
      other: number
      total: number
    }[]
    year: string
  }
}

interface Emission {
  id: number
  type: string
  category: string
  amount: string
  unit: string
  carbonValue: string
  cost: string | null
  date: string
  scope: string
  workerId: number | null
  companyId: number
  source: string
  createdAt: string
  updatedAt: string
}

interface MonthlyData {
  currentMonth: number
  previousMonth: number
  difference: number
  currentMonthDate: string
  previousMonthDate: string
}

type EmissionBreakdown = {
  source: string
  value: number
}

const sourceColors = {
  kagit: "hsl(145, 70%, 50%)",
  dogalgaz: "hsl(20, 70%, 50%)",
  elektrik: "hsl(200, 70%, 50%)",
  su: "hsl(230, 70%, 50%)",
  dizel_otomobil: "hsl(280, 70%, 50%)"
}

const sourceLabels = {
  kagit: "Paper",
  dogalgaz: "Natural Gas",
  elektrik: "Electricity",
  su: "Water",
  dizel_otomobil: "Vehicles",
  telekom: "Telecom",
  eposta: "Email",
  fax: "Fax",
  benzin_otomobil: "Gasoline Vehicles",
  elektrik_otomobil: "Electric Vehicles",
  jenerator: "Generator",
  hayvansal_gida: "Animal Feed",
  
}

const COVERAGE_DATA = [
  {
    title: "Coverage 1 (Direct Emissions)",
    color: "bg-red-500",
    textColor: "text-red-700",
    description: "Direct emissions from company-owned or controlled sources including vehicles (diesel: 0.171 KG_CO2/KM, gasoline: 0.192 KG_CO2/KM, electric: 0.053 KG_CO2/KM), natural gas usage (2 KG_CO2/M3), and generators (2.3 KG_CO2/L)."
  },
  {
    title: "Coverage 2 (Energy Consumption)",
    color: "bg-amber-500",
    textColor: "text-amber-700",
    description: "Indirect emissions from purchased electricity, heating, and cooling systems used in operations."
  },
  {
    title: "Coverage 3 (Other Indirect)",
    color: "bg-green-500",
    textColor: "text-green-700",
    description: "Other indirect emissions from the value chain including business travel, waste disposal, and purchased goods/services."
  }
]

function EmptyState({ message = "No data available" }: { message?: string }) {
  return (
    <div className="h-full flex items-center justify-center">
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  )
}

// Add this function to filter current month emissions
function getCurrentMonthEmissions(emissions: Emission[]) {
  const currentDate = new Date()
  return emissions.filter(emission => {
    const emissionDate = new Date(emission.date)
    return emissionDate.getMonth() === currentDate.getMonth() &&
           emissionDate.getFullYear() === currentDate.getFullYear()
  })
}

// Add this function to get top 10 emissions by carbon value
function getTopTenEmissions(emissions: Emission[]) {
  return emissions
    .sort((a, b) => parseFloat(b.carbonValue) - parseFloat(a.carbonValue))
    .slice(0, 10);
}

// Add columns definition
const columns: ColumnDef<Emission, any>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }: { row: { original: Emission } }) => formatDate(row.original.date)
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }: { row: { original: Emission } }) => row.original.category.toUpperCase()
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }: { row: { original: Emission } }) => `${row.original.amount} ${row.original.unit}`
  },
  {
    accessorKey: "carbonValue",
    header: "Carbon Value",
    cell: ({ row }: { row: { original: Emission } }) => `${row.original.amount} kg CO₂e`
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ row }: { row: { original: Emission } }) => row.original.cost ? `₺${row.original.cost}` : '-'
  },
  {
    accessorKey: "scope",
    header: "Scope",
    cell: ({ row }: { row: { original: Emission } }) => row.original.scope
  }
]

export default function DashboardPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const companyName = session?.user?.name ?? "Guest"
  const [emissions, setEmissions] = useState<Emission[]>([])
  const [coveragePercentages, setCoveragePercentages] = useState<number[]>([0, 0, 0])

  useEffect(() => {
    const fetchAllData = async () => {
      if (!session?.user?.token) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        await Promise.all([
          fetchDashboardData(),
          fetchEmissions(),
          fetchMonthlyData()
        ])
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchDashboardData = async () => {
      if (!session?.user?.token) {
        setIsLoading(false)
        return
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.user.token}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        }).catch(err => {
          console.error('Fetch error:', err)
          throw new Error('Network error occurred')
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          console.error('API error:', errorData)
          throw new Error(errorData.message || `HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        setDashboardData(data)
        setError(null)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        setError(error instanceof Error ? error.message : 'Failed to load dashboard data')
        setDashboardData(null)
      }
    }

    const fetchEmissions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emissions/emission`, {
          headers: {
            'Authorization': `Bearer ${session?.user?.token}`,
          }
        })
        const data = await res.json()
        if (data.success) {
          setEmissions(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch emissions:', error)
      }
    }

    const fetchMonthlyData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/monthly`, {
          headers: {
            'Authorization': `Bearer ${session?.user?.token}`,
          }
        })
        const data = await res.json()
        setMonthlyData(data)
      } catch (error) {
        console.error('Failed to fetch monthly data:', error)
      }
    }

    fetchAllData()
  }, [session?.user?.token])

  useEffect(() => {
    const fetchCoverageData = async () => {
      if (!session?.user?.token) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
          headers: {
            'Authorization': `Bearer ${session.user.token}`,
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch coverage data');
        
        const data: DashboardData = await response.json();

        // Calculate total emissions from monthly breakdown
        const monthlyBreakdown = data.monthly.breakdown;
        const total = monthlyBreakdown.reduce((acc, curr) => acc + curr.value, 0);

        // Calculate Coverage 1 (Direct Emissions)
        const coverage1Sources = ['dizel_otomobil', 'benzin_otomobil', 'dogalgaz'];
        const coverage1Total = monthlyBreakdown
          .filter(item => coverage1Sources.includes(item.source))
          .reduce((acc, curr) => acc + curr.value, 0);

        // Calculate Coverage 2 (Energy Consumption)
        const coverage2Sources = ['elektrik', 'elektrik_otomobil'];
        const coverage2Total = monthlyBreakdown
          .filter(item => coverage2Sources.includes(item.source))
          .reduce((acc, curr) => acc + curr.value, 0);

        // Calculate Coverage 3 (Other Indirect)
        const coverage3Total = monthlyBreakdown
          .filter(item => ![...coverage1Sources, ...coverage2Sources].includes(item.source))
          .reduce((acc, curr) => acc + curr.value, 0);

        // Calculate percentages
        const percentages = [
          Math.round((coverage1Total / total) * 100),
          Math.round((coverage2Total / total) * 100),
          Math.round((coverage3Total / total) * 100)
        ];

        setCoveragePercentages(percentages);
      } catch (error) {
        console.error('Error fetching coverage data:', error);
        setCoveragePercentages([35, 25, 40]);
      }
    };

    fetchCoverageData();
  }, [session?.user?.token]);

  // Transform data for pie charts
  const dailyPieData = dashboardData?.daily.breakdown.map(item => ({
    id: sourceLabels[item.source as keyof typeof sourceLabels],
    value: item.value,
    color: sourceColors[item.source as keyof typeof sourceColors]
  })) || []

  const monthlyPieData = dashboardData?.monthly.breakdown.map(item => ({
    id: sourceLabels[item.source as keyof typeof sourceLabels],
    value: item.value,
    color: sourceColors[item.source as keyof typeof sourceColors]
  })) || []

  // Transform data for line chart
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const yearlyLineData = dashboardData?.yearly.monthlyData.map(item => ({
    month: monthNames[item.month - 1],
    total: item.total,
    electricity: item.electricity,
    naturalGas: item.naturalGas,
    vehicles: item.vehicles,
    waste: item.waste,
    other: item.other
  })) || []

  const hasData = {
    daily: dailyPieData.some(item => item.value > 0),
    monthly: monthlyPieData.some(item => item.value > 0),
    yearly: yearlyLineData.some(item => item.total > 0)
  }

  const currentMonthEmissions = getCurrentMonthEmissions(emissions)

  // Calculate percentage change with zero check
  const percentageChange = monthlyData 
    ? monthlyData.previousMonth === 0
      ? monthlyData.currentMonth > 0 
        ? 100  // If previous was 0 and current has value, show 100% increase
        : 0    // If both are 0, show 0% change
      : ((monthlyData.difference / monthlyData.previousMonth) * 100)
    : 0

  // Get top 10 emissions for the table
  const topTenEmissions = getTopTenEmissions(currentMonthEmissions)

  return (
    <div className="min-h-screen-navbar flex flex-col lg:flex-row gap-8">
      {/* Left Section - Company Info */}
      <div className="lg:w-1/3 space-y-12 p-4 lg:sticky lg:top-[var(--navbar-height)] lg:h-[calc(100vh-var(--navbar-height))]">
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
          ) : monthlyData ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold">
                  {Number.isFinite(percentageChange) ? Math.abs(percentageChange).toFixed(1) : '0'}%
                </span>
                <div className="flex flex-col">
                  <span className={`text-xl ${percentageChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {percentageChange <= 0 ? 'better' : 'worse'} than last month
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({Math.abs(monthlyData.difference).toFixed(1)} kg CO₂e)
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold text-forest">
                  {session?.user?.points}
                </span>
                <span className="text-xl text-forest">
                  carbon points
                </span>
              </div>

              {/* Add Coverage Section here, right after points */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Emission Coverage</h3>
                {COVERAGE_DATA.map((coverage, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${coverage.textColor}`}>
                        {coverage.title}
                      </span>
                      <span className="font-bold">{coveragePercentages[index]}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${coverage.color} transition-all duration-500`}
                        style={{ width: `${coveragePercentages[index] ? coveragePercentages[index] : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              No comparison data available yet
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Right Section - Charts */}
      <div className="lg:w-2/3 flex flex-col gap-8 p-4">
        {/* Pie Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            <>
              <Card className="p-6 border-none bg-background/50 shadow-none">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="h-[200px] flex items-center justify-center">
                  <div className="w-[200px] h-[200px] relative">
                    <Skeleton className="absolute inset-0" />
                    <Skeleton className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full" />
                  </div>
                </div>
              </Card>
              <Card className="p-6 border-none bg-background/50 shadow-none">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="h-[200px] flex items-center justify-center">
                  <div className="w-[200px] h-[200px] relative">
                    <Skeleton className="absolute inset-0" />
                    <Skeleton className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full" />
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <>
              <Card className="p-6 border-none bg-background/50 shadow-none">
                <h2 className="text-xl font-semibold mb-4">Daily Carbon Footprint</h2>
                <div className="h-[200px]">
                  {hasData.daily ? (
                    <ResponsivePie
                      data={dailyPieData}
                      margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
                      innerRadius={0.5}
                      padAngle={0.7}
                      cornerRadius={3}
                      activeOuterRadiusOffset={8}
                      colors={{ datum: 'data.color' }}
                      enableArcLinkLabels={true}
                      arcLinkLabelsColor={{ from: 'color' }}
                      arcLinkLabelsThickness={1}
                      arcLinkLabelsSkipAngle={10}
                      arcLinkLabelsDiagonalLength={16}
                      arcLinkLabelsTextOffset={6}
                      arcLabelsSkipAngle={10}
                      arcLabelsTextColor="white"
                    />
                  ) : (
                    <EmptyState message="No daily data available" />
                  )}
                </div>
              </Card>

              <Card className="p-6 border-none bg-background/50 shadow-none">
                <h2 className="text-xl font-semibold mb-4">Monthly Carbon Footprint</h2>
                <div className="h-[200px]">
                  {hasData.monthly ? (
                    <ResponsivePie
                      data={monthlyPieData}
                      margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
                      innerRadius={0.5}
                      padAngle={0.7}
                      cornerRadius={3}
                      activeOuterRadiusOffset={8}
                      colors={{ datum: 'data.color' }}
                      enableArcLinkLabels={true}
                      arcLinkLabelsColor={{ from: 'color' }}
                      arcLinkLabelsThickness={1}
                      arcLinkLabelsSkipAngle={10}
                      arcLinkLabelsDiagonalLength={16}
                      arcLinkLabelsTextOffset={6}
                      arcLabelsSkipAngle={10}
                      arcLabelsTextColor="white"
                    />
                  ) : (
                    <EmptyState message="No monthly data available" />
                  )}
                </div>
              </Card>
            </>
          )}
        </div>

        {/* Line Chart */}
        {isLoading ? (
          <Card className="p-6 border-none bg-background/50 shadow-none">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="h-[200px] space-y-4">
              <Skeleton className="w-full h-[1px]" /> {/* X-axis */}
              <div className="relative h-full">
                <Skeleton className="absolute left-0 h-full w-[1px]" /> {/* Y-axis */}
                <div className="h-full w-full pl-4 flex items-end">
                  <div className="flex-1 px-1"><Skeleton className="w-full h-[60%]" /></div>
                  <div className="flex-1 px-1"><Skeleton className="w-full h-[80%]" /></div>
                  <div className="flex-1 px-1"><Skeleton className="w-full h-[40%]" /></div>
                  <div className="flex-1 px-1"><Skeleton className="w-full h-[70%]" /></div>
                  <div className="flex-1 px-1"><Skeleton className="w-full h-[50%]" /></div>
                  <div className="flex-1 px-1"><Skeleton className="w-full h-[90%]" /></div>
                  <div className="flex-1 px-1"><Skeleton className="w-full h-[30%]" /></div>
                  <div className="flex-1 px-1"><Skeleton className="w-full h-[65%]" /></div>
                  <div className="flex-1 px-1"><Skeleton className="w-full h-[45%]" /></div>
                  <div className="flex-1 px-1"><Skeleton className="w-full h-[75%]" /></div>
                  <div className="flex-1 px-1"><Skeleton className="w-full h-[55%]" /></div>
                  <div className="flex-1 px-1"><Skeleton className="w-full h-[85%]" /></div>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6 border-none bg-background/50 shadow-none">
            <h2 className="text-xl font-semibold mb-4">Yearly Carbon Footprint Trend</h2>
            <div className="h-[200px]">
              {hasData.yearly ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlyLineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={{ strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="No yearly data available" />
              )}
            </div>
          </Card>
        )}

        {/* Modify the table section */}
        <div className="w-full p-4">
          <Card className="p-6 border-none bg-background/50 shadow-none">
            <h2 className="text-xl font-semibold mb-4">Top 10 Highest Emissions This Month</h2>
            <DataTable 
              columns={columns} 
              data={topTenEmissions}
              loading={isLoading} 
            />
          </Card>
        </div>
      </div>
    </div>
  )
}