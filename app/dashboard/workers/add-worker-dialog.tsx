"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { notify } from "@/lib/utils/toast"
import { Worker } from "@/hooks/use-workers"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  department: z.string().min(1, "Department is required"),
})

interface AddWorkerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  worker?: Worker
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>
}

export function AddWorkerDialog({ 
  open, 
  onOpenChange, 
  onSuccess,
  worker,
  onSubmit 
}: AddWorkerDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: worker?.name || "",
      department: worker?.department || "",
    }
  })

  // Reset form when worker changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: worker?.name || "",
        department: worker?.department || "",
      })
    }
  }, [form, worker, open])

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      await onSubmit(values)
      onSuccess()
      form.reset()
    } catch (error) {
      notify.error("Failed to save worker")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{worker ? "Edit Worker" : "Add New Worker"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter department" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 