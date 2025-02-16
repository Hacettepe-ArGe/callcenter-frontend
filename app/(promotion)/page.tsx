"use client"

import { useUser } from "@/components/providers/user-provider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { GoogleIcon } from "@/components/icons/google"
import Image from 'next/image'
import { cn } from "@/lib/utils"


export default function Home() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const { user } = useUser()
    const [coveragePercentages, setCoveragePercentages] = useState<number[]>([0, 0, 0])

    const handleSignIn = () => {
        router.push(`/signup?email=${encodeURIComponent(email)}`)
    }


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

        </div>
    )
}
