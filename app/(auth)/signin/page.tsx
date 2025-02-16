"use client"

import { Button } from "@/components/ui/button"
import { SignInForm } from "./components/signin-form"
import { SocialLogin } from "./components/social-login"
import Link from "next/link"
import { Suspense } from 'react'
import Image from "next/image"

export default function SignIn() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignInContent />
        </Suspense>
    )
}

function SignInContent() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative">
                <div className="absolute top-4 right-4">
            <Link href="/signup">
                <Button variant="ghost" className="gap-2 text-sm sm:text-base">
                    Don't have an account?
                            <span className="font-semibold">Sign up</span>
                        </Button>
                        </Link>
                </div>
                <div className="absolute top-4 left-4">
                    <Link href="/">
                        <Image src="/logo.svg" alt="carbonbusters" width={50} height={50} />
                    </Link>
                </div>
            <div className="w-full max-w-md space-y-8 relative">
                <SignInForm />
                <SocialLogin />
            </div>
        </div>
    )
}