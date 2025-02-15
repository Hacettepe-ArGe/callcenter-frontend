"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { notify } from "@/lib/utils/toast"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useUser } from "@/components/providers/user-provider"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})

export function SignInForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { login } = useUser()
    const email = searchParams.get('email')
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    useEffect(() => {
        if (email) {
            form.setValue('email', email)
        }
    }, [email, form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await login(values.email, values.password)
            notify.success("Successfully logged in!")
            router.push('/')
        } catch (error) {
            notify.error("Invalid credentials")
            console.error('Login error:', error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <h1 className="text-3xl font-bold text-forest">Welcome back</h1>
                <p className="text-forest/60">Enter your credentials to sign in</p>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="example@email.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your password" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button type="submit" className="w-full">
                    Sign in
                </Button>
            </form>
        </Form>
    )
} 