"use client"

import { useState } from "react"
import { useWorkers, Worker } from "@/hooks/use-workers"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { notify } from "@/lib/utils/toast"
import { ColumnDef } from "@tanstack/react-table"
import { PlusIcon, Pencil, Trash2Icon } from "lucide-react"
import { AddWorkerDialog } from "./add-worker-dialog"

export default function WorkersPage() {
  const { workers, isLoading, deleteWorker, createWorker, updateWorker } = useWorkers()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedWorker, setSelectedWorker] = useState<Worker | undefined>()

  const handleDelete = async (id: number) => {
    try {
      await deleteWorker(id)
      notify.success("Worker deleted successfully")
    } catch (error) {
      notify.error("Failed to delete worker")
    }
  }

  const handleSubmit = async (values: { name: string; department: string }) => {
    if (selectedWorker) {
      await updateWorker(selectedWorker.id, values.name, values.department)
      notify.success("Worker updated successfully")
    } else {
      await createWorker(values.name, values.department)
      notify.success("Worker created successfully")
    }
  }

  const columns: ColumnDef<Worker>[] = [
    {
      accessorKey: "name",
      header: "Name"
    },
    {
      accessorKey: "department",
      header: "Department"
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const worker = row.original
        return (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                setSelectedWorker(worker)
                setIsDialogOpen(true)
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="destructive" 
              size="icon"
              onClick={() => handleDelete(worker.id)}
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
        )
      }
    }
  ]

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Workers</h1>
        <Button onClick={() => {
          setSelectedWorker(undefined)
          setIsDialogOpen(true)
        }}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Worker
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={workers} 
        loading={isLoading}
      />

      <AddWorkerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          setIsDialogOpen(false)
          setSelectedWorker(undefined)
        }}
        worker={selectedWorker}
        onSubmit={handleSubmit}
      />
    </div>
  )
} 