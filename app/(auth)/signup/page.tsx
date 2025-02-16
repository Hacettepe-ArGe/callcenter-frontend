"use client"

import { Button } from "@/components/ui/button"
import { SignUpForm } from "./components/signup-form"
import Link from "next/link"
import Image from "next/image"
export default function SignUp() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative">
                <div className="absolute top-4 right-4">
                    <Link href="/signin">
                        <Button variant="ghost" className="gap-2 text-sm sm:text-base">
                            Already have an account?
                            <span className="font-semibold">Sign in</span>
                        </Button>
                    </Link>
                </div>
                <div className="absolute top-4 left-4">
                    <Link href="/">
                        <Image src="/logo.svg" alt="carbonbusters" width={50} height={50} />
                    </Link>
                </div>
            <div className="w-full max-w-md space-y-8">

                <div className="space-y-2 text-center pt-16">
                    <h1 className="text-3xl font-bold">Create an account</h1>
                    <p className="text-gray-500">Enter your information to get started</p>
                </div>

                <SignUpForm />
            </div>
        </div>
    )
}
