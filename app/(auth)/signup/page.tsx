"use client"

import { Button } from "@/components/ui/button"
import { AuthHero } from "../signin/components/auth-hero"
import { SignUpForm } from "./components/signup-form"
import { SocialLogin } from "../signin/components/social-login"
import Link from "next/link"

export default function SignUp() {
    return (
        <div className="flex min-h-screen">
            <AuthHero />
            <div className="w-full md:w-1/2 lg:w-5/12 p-4 sm:p-8 relative">
                <div className="absolute top-4 sm:top-8 right-4 sm:right-8">
                    <Link href="/signin">
                        <Button variant="ghost" className="gap-2 text-sm sm:text-base">
                            Already have an account?
                            <span className="font-semibold">Sign in</span>
                        </Button>
                    </Link>
                </div>
                <div className="flex items-center justify-center h-full pt-16 sm:pt-0">
                    <div className="w-full max-w-md space-y-8">
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold">Create an account</h1>
                            <p className="text-gray-500">Enter your details to get started</p>
                        </div>

                        <SignUpForm />
                        <SocialLogin />
                    </div>
                </div>
            </div>
        </div>
    )
}
