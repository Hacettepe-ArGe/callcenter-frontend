"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notify } from "@/lib/utils/toast"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/providers/user-provider"
import { User } from "@/lib/types/user"

export default function DevLogin() {
    const router = useRouter()
    const { setUser } = useUser()
    
    const devAccounts = [
        { email: "dev@dev.dev", password: "dev", id: "dev-1" },
    ]

    const loginAsDev = async () => {
        const devUser: User = {
            id: "dev-1",
            email: "dev@dev.dev",
        }
        
        try {
            await setUser(devUser)
        } catch (error) {
            console.error('Dev login failed:', error)
        }
    }

    if (process.env.NODE_ENV === "production") {
        return null
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Developer Access</h1>
                    <p className="text-muted-foreground">Quick access for development purposes</p>
                </div>

                <div className="space-y-4">
                    {devAccounts.map((account) => (
                        <Button
                            key={account.email}
                            variant="outline"
                            className="w-full justify-between"
                            onClick={() => loginAsDev()}
                        >
                            <span>{account.email}</span>
                        </Button>
                    ))}
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                or
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Link href="/signin">
                            <Button variant="ghost">
                                Go to normal login
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    <p>⚠️ This page is only available in development mode</p>
                </div>
            </div>
        </div>
    )
} 