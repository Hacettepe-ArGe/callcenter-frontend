"use client"

import { Button } from "@/components/ui/button"
import { AuthHero } from "./components/auth-hero"
import { SignInForm } from "./components/signin-form"
import { SocialLogin } from "./components/social-login"
import Link from "next/link"

export default function SignIn() {
    return (
        <div className="flex min-h-screen">
            <AuthHero />
            <div className="w-full md:w-1/2 lg:w-5/12 p-8 relative">
                {process.env.NODE_ENV === "development" && (
                    <div className="absolute top-8 left-8">
                        <Link href="/dev">
                            <Button 
                                variant="ghost" 
                                className="text-xs text-forest hover:text-forest hover:bg-sage/20"
                            >
                                Dev Access
                            </Button>
                        </Link>
                    </div>
                )}
                <div className="absolute top-8 right-8">
                    <Link href="/signup">
                        <Button variant="ghost" className="gap-2">
                            Don't have an account?
                            <span className="font-semibold">Sign up</span>
                        </Button>
                    </Link>
                </div>
                <div className="flex items-center justify-center h-full">
                    <div className="w-full max-w-md space-y-8">
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold">Welcome back</h1>
                            <p className="text-gray-500">Enter your credentials to sign in</p>
                        </div>

                        <SignInForm />
                        <SocialLogin />
                    </div>
                </div>
            </div>
        </div>
    )
}