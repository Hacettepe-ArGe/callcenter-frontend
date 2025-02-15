"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

const accountSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const companySchema = z.object({
    companyName: z.string().min(2, {
        message: "Company name must be at least 2 characters.",
    }),
    companySize: z.string({
        required_error: "Please select your company size.",
    }),
    companyType: z.string({
        required_error: "Please select your company type.",
    }),
    industry: z.string({
        required_error: "Please select your industry.",
    }),
});

export function SignUpForm() {
    const [step, setStep] = useState<1 | 2>(1)

    const accountForm = useForm<z.infer<typeof accountSchema>>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const companyForm = useForm<z.infer<typeof companySchema>>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            companyName: "",
            companySize: "",
            companyType: "",
            industry: "",
        },
    })

    function onSubmitAccountDetails(values: z.infer<typeof accountSchema>) {
        console.log('Account details:', values)
        setStep(2)
    }

    function onSubmitCompanyDetails(values: z.infer<typeof companySchema>) {
        console.log('Company details:', values)
        // Here you would typically combine both forms' data and submit to your API
        console.log('All form data:', {
            ...accountForm.getValues(),
            ...values
        })
    }

    return (
        <div className="space-y-6">
            {step === 1 ? (
                <Form {...accountForm}>
                    <form onSubmit={accountForm.handleSubmit(onSubmitAccountDetails)} className="space-y-6">
                        <FormField
                            control={accountForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="example@company.com" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={accountForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Create a password" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={accountForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Confirm your password" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <Button type="submit" className="w-full bg-sage hover:bg-sage-light text-forest">
                            Continue
                        </Button>
                    </form>
                </Form>
            ) : (
                <Form {...companyForm}>
                    <form onSubmit={companyForm.handleSubmit(onSubmitCompanyDetails)} className="space-y-6">
                        <FormField
                            control={companyForm.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your company name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={companyForm.control}
                            name="companySize"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Size</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select company size" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1-10">1-10 employees</SelectItem>
                                            <SelectItem value="11-50">11-50 employees</SelectItem>
                                            <SelectItem value="51-200">51-200 employees</SelectItem>
                                            <SelectItem value="201-500">201-500 employees</SelectItem>
                                            <SelectItem value="501+">501+ employees</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={companyForm.control}
                            name="companyType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select company type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="corporation">Corporation</SelectItem>
                                            <SelectItem value="llc">LLC</SelectItem>
                                            <SelectItem value="partnership">Partnership</SelectItem>
                                            <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={companyForm.control}
                            name="industry"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Industry</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select industry" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="technology">Technology</SelectItem>
                                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                            <SelectItem value="retail">Retail</SelectItem>
                                            <SelectItem value="healthcare">Healthcare</SelectItem>
                                            <SelectItem value="finance">Finance</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <div className="flex gap-4">
                            <Button type="button" variant="outline" className="w-full" onClick={() => setStep(1)}>
                                Back
                            </Button>
                            <Button type="submit" className="w-full bg-sage hover:bg-sage-light text-forest">
                                Create Account
                            </Button>
                        </div>
                    </form>
                </Form>
            )}

            <div className="flex items-center gap-4">
                <div className="h-2 flex-1 rounded-full bg-muted">
                    <div className={`h-full rounded-full bg-primary transition-all ${step === 1 ? "w-1/2" : "w-full"}`} />
                </div>
                <span className="text-sm text-muted-foreground">Step {step} of 2</span>
            </div>
        </div>
    )
} 