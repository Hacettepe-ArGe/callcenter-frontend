"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BusinessForm } from "./business-form"
import { UserForm } from "./user-form"
import { EmissionTypes } from "@/hooks/use-emission-types"

interface AddConsumptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  emissionTypes: EmissionTypes
}

export function AddConsumptionDialog({ 
  open, 
  onOpenChange,
  onSuccess,
  emissionTypes 
}: AddConsumptionDialogProps) {
  const [activeTab, setActiveTab] = useState<"business" | "user">("business")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Consumption</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "business" | "user")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="user">User</TabsTrigger>
          </TabsList>
          <TabsContent value="business">
            <BusinessForm onSuccess={onSuccess} emissionTypes={emissionTypes} />
          </TabsContent>
          <TabsContent value="user">
            <UserForm onSuccess={onSuccess} emissionTypes={emissionTypes} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 