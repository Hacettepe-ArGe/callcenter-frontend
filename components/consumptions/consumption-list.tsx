"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/app/dashboard/consumptions/data-table"
import { AddConsumptionDialog } from "@/app/dashboard/consumptions/add-consumption-dialog"
import { columns } from "@/app/dashboard/consumptions/columns"
import { Skeleton } from "@/components/ui/skeleton"
import { useConsumptions } from "@/hooks/use-consumptions"
import { PlusIcon } from "lucide-react"

export function ConsumptionList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { consumptions, isLoading, mutate } = useConsumptions()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Consumptions</h1>
          <p className="text-muted-foreground">Manage your carbon footprint records</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Consumption
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <DataTable columns={columns} data={consumptions} />
      )}

      <AddConsumptionDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          setIsDialogOpen(false)
          mutate()
        }}
      />
    </div>
  )
} 