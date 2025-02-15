"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const companySchema = z.object({
    companyName: z.string().min(2, {
        message: "Company name must be at least 2 characters.",
    }),
})

type CompanyFormProps = {
    onSubmit: (data: z.infer<typeof companySchema>) => void;
    onBack: () => void;
}

export function CompanyForm({ onSubmit, onBack }: CompanyFormProps) {
    const form = useForm<z.infer<typeof companySchema>>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            companyName: "",
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Your company name"
                                    autoComplete="organization"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-4">
                    <Button type="button" variant="outline" className="w-full" onClick={onBack}>
                        Back
                    </Button>
                    <Button type="submit" className="w-full">Create Account</Button>
                </div>
            </form>
        </Form>
    )
} 