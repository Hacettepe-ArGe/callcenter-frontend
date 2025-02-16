"use client"

import { useUser } from "@/components/providers/user-provider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { GoogleIcon } from "@/components/icons/google"
import Image from 'next/image'
import { cn } from "@/lib/utils"

// Add these type definitions at the top of the file
type EmissionBreakdown = {
  source: string
  value: number
}

type DashboardData = {
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

export default function Home() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const { user } = useUser()
    const [coveragePercentages, setCoveragePercentages] = useState<number[]>([0, 0, 0])

    const handleSignIn = () => {
        router.push(`/signup?email=${encodeURIComponent(email)}`)
    }

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('/api/dashboard')
                const data: DashboardData = await response.json()

                // Calculate total emissions from monthly breakdown
                const monthlyBreakdown = data.monthly.breakdown
                const total = monthlyBreakdown.reduce((acc, curr) => acc + curr.value, 0)

                // Calculate Coverage 1 (Direct Emissions)
                const coverage1Sources = ['dizel_otomobil', 'benzin_otomobil', 'dogalgaz']
                const coverage1Total = monthlyBreakdown
                    .filter(item => coverage1Sources.includes(item.source))
                    .reduce((acc, curr) => acc + curr.value, 0)

                // Calculate Coverage 2 (Energy Consumption)
                const coverage2Sources = ['elektrik', 'elektrik_otomobil']
                const coverage2Total = monthlyBreakdown
                    .filter(item => coverage2Sources.includes(item.source))
                    .reduce((acc, curr) => acc + curr.value, 0)

                // Calculate Coverage 3 (Other Indirect)
                const coverage3Total = monthlyBreakdown
                    .filter(item => ![...coverage1Sources, ...coverage2Sources].includes(item.source))
                    .reduce((acc, curr) => acc + curr.value, 0)

                // Calculate percentages
                const percentages = [
                    Math.round((coverage1Total / total) * 100),
                    Math.round((coverage2Total / total) * 100),
                    Math.round((coverage3Total / total) * 100)
                ]

                setCoveragePercentages(percentages)
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
                // Fallback to default percentages
                setCoveragePercentages([35, 25, 40])
            }
        }

        fetchDashboardData()
    }, [])

    return (
        <div className="flex flex-col lg:flex-row items-center justify-between h-full gap-8 py-12">
            {/* Left Content */}
            <div className="flex flex-col items-start justify-center gap-8 w-full lg:w-1/2">
                <div className="space-y-4">
                    <h1 className="text-5xl font-khand md:text-6xl lg:text-8xl">make <br/> difference.</h1>
                    <p className="text-lg text-forest/60">Track your CO₂ emissions and reduce your carbon footprint.</p>
                </div>

                {user ? (
                    <Button onClick={() => router.push('/dashboard')} className="max-w-sm bg-sage text-white hover:bg-sage/80">
                        Go to Dashboard
                    </Button>
                ) : (
                    <div className="space-y-4 w-full max-w-sm">
                        <div className="flex gap-2 flex-col">
                            <Input 
                                type="email" 
                                className="text-sm sm:text-base h-10 sm:h-12"
                                placeholder="Enter your email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button onClick={handleSignIn} className="bg-sage text-white hover:bg-forest/80">
                                Get Started
                            </Button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-cream px-2 text-muted-foreground">
                                    or
                                </span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full cursor-not-allowed">
                            <GoogleIcon />
                            Continue with Google
                        </Button>
                    </div>
                )}
            </div>

            {/* Right Image */}
            <div className="w-full lg:w-1/2 flex justify-center items-center">
                <div className="relative w-[280px] h-[280px] md:w-[600px] md:h-[600px]">
                    <Image
                        src="/homehero.png"
                        alt="Globe Illustration"
                        fill
                        className="object-contain mix-blend-multiply"
                        priority
                    />
                </div>
            </div>

            {/* Add this after the points section */}
            <section className="py-24 bg-muted/50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Understanding Carbon Footprint Coverage</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {COVERAGE_DATA.map((coverage, index) => (
                            <div 
                                key={index}
                                className="relative overflow-hidden rounded-lg p-6 shadow-lg bg-white"
                            >
                                <div className="space-y-4">
                                    <h3 className={`text-lg font-semibold ${coverage.textColor}`}>
                                        {coverage.title}
                                    </h3>
                                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${coverage.color} transition-all duration-500`}
                                            style={{ width: `${coveragePercentages[index]}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {coverage.description}
                                    </p>
                                    <p className="text-xl font-bold">
                                        {coveragePercentages[index]}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
