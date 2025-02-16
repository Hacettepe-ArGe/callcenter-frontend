"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/app/dashboard/consumptions/data-table"
import { AddConsumptionDialog } from "@/app/dashboard/consumptions/add-consumption-dialog"
import { columns, deleteEmissions } from "@/app/dashboard/consumptions/columns"
import { Skeleton } from "@/components/ui/skeleton"
import { useConsumptions } from "@/hooks/use-consumptions"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { useSession } from "next-auth/react"
import { notify } from "@/lib/utils/toast"
import { useEmissionTypes } from "@/hooks/use-emission-types"

export function ConsumptionList() {
  const { data: session } = useSession()
  const { types, isLoading: typesLoading } = useEmissionTypes()
  const { consumptions, isLoading: consumptionsLoading, mutate } = useConsumptions()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  const isLoading = typesLoading || consumptionsLoading

  const handleDelete = async () => {
    if (selectedRows.length === 0 || !session) return
    
    try {       
      const success = await deleteEmissions(selectedRows, session)
      if (success) {
        notify.success(`${selectedRows.length} emissions deleted successfully`)
        setSelectedRows([])
        await mutate()
      } else {
        throw new Error("Failed to delete emissions")
      }
    } catch (error) {
      notify.error("Failed to delete emissions")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Consumptions</h1>
          <p className="text-muted-foreground">
            {selectedRows.length > 0 
              ? `${selectedRows.length} items selected`
              : "Manage your carbon footprint records"
            }
          </p>
        </div>
        <div className="flex gap-2">
          {selectedRows.length > 0 && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2Icon className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          )}
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Consumption
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={consumptions}
          onRowSelectionChange={setSelectedRows}
        />
      )}

      <AddConsumptionDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          setIsDialogOpen(false)
          mutate()
        }}
        emissionTypes={types}
      />
    </div>
  )
} 