"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { notify } from "@/lib/utils/toast"
import { AccountForm } from "./account-form"
import { CompanyForm } from "./company-form"

type AccountData = {
    email: string;
    password: string;
    confirmPassword: string;
}

type CompanyData = {
    companyName: string;
}

export function SignUpForm() {
    const [step, setStep] = useState<1 | 2>(1)
    const [accountData, setAccountData] = useState<AccountData | null>(null)
    const router = useRouter()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    const handleAccountSubmit = (data: AccountData) => {
        setAccountData(data)
        setStep(2)
    }

    const handleCompanySubmit = async (data: CompanyData) => {
        if (!accountData || !apiUrl) return

        const formData = {
            email: accountData.email,
            password: accountData.password,
            companyName: data.companyName,
        }

        try {
            const response = await fetch(`${apiUrl}/api/auth/register`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || "Registration failed")
            }
            
            notify.success("Account created successfully!")
            router.push("/signin")
        } catch (error) {
            notify.error(error instanceof Error ? error.message : "Registration failed")
            console.error("Registration error:", error)
        }
    }

    return (
        <div className="space-y-6">
            {step === 1 ? (
                <AccountForm onSubmit={handleAccountSubmit} />
            ) : (
                <CompanyForm 
                    onSubmit={handleCompanySubmit}
                    onBack={() => setStep(1)}
                />
            )}

            <div className="flex items-center gap-4">
                <div className="h-2 flex-1 rounded-full bg-muted">
                    <div className={`h-full rounded-full bg-primary transition-all ${
                        step === 1 ? "w-1/2" : "w-full"
                    }`} />
                </div>
                <span className="text-sm text-muted-foreground">Step {step} of 2</span>
            </div>
        </div>
    )
}
