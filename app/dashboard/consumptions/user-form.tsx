"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmissionTypes } from "@/hooks/use-emission-types"
import { useWorkers } from "@/hooks/use-workers"
import { useSession } from "next-auth/react"
import { notify } from "@/lib/utils/toast"
import { useState } from "react"

const formSchema = z.object({
  userId: z.string(),
  category: z.string(),
  type: z.string(),
  amount: z.string(),
})

interface UserFormProps {
  onSuccess: () => void
  emissionTypes: EmissionTypes
}

export function UserForm({ onSuccess, emissionTypes }: UserFormProps) {
  const { data: session } = useSession()
  const { workers, isLoading } = useWorkers()
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const filteredCategories = Object.entries(emissionTypes).reduce((acc, [category, types]) => {
    if (['kagit', 'jenerator'].includes(category.toLowerCase())) {
      return acc;
    }
    acc[category] = types;
    return acc;
  }, {} as EmissionTypes);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user?.token) {
      notify.error("You must be logged in")
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emissions/emission/${values.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.token}`
        },
        body: JSON.stringify({
          type: values.type,
          category: values.category,
          amount: parseFloat(values.amount),
          scope: 'CALISAN',
          workerId: parseInt(values.userId),
          companyId: session.user.id,
          name: session.user.name
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create emission')
      }

      notify.success("Emission added successfully")
      onSuccess()
    } catch (error) {
      notify.error("Failed to add emission")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {workers.map((worker) => (
                    <SelectItem key={worker.id} value={worker.id.toString()}>
                      {worker.name} - {worker.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value)
                  setSelectedCategory(value)
                  // Reset type when category changes
                  form.setValue('type', '')
                }} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(filteredCategories).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger disabled={!selectedCategory}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectedCategory && filteredCategories[selectedCategory]?.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount in {filteredCategories[selectedCategory]?.[0]}</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  )
} 