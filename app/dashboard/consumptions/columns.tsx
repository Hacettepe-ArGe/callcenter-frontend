"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./data-table-column-header"
import { format } from "date-fns"
import { Session } from "next-auth"
export type Consumption = {
  id: number
  category: string
  amount: number
  type: string
  carbonValue: number
  createdAt: string
  workerId?: number
  userName?: string
}

export const columns: ColumnDef<Consumption>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
  },
  {
    accessorKey: "carbonValue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Carbon Value" />
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
  },
  {
    accessorKey: "workerId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => format(new Date(row.original.createdAt), 'PP'),
  },
]

export async function deleteEmissions(ids: number[], session: Session) {

  if (!ids.length) {
    console.error('No IDs provided for deletion');
    return false;
  }

  try {
    const responses = await Promise.all(
      ids.map(id => {
        const payload = { emissionId: id };
        console.log('Sending delete request for ID:', id, 'with payload:', payload);
        
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emissions/emission`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.user?.token}`
          },
          body: JSON.stringify(payload)
        }).then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json();
            console.error('Delete request failed for ID:', id, 'Error:', errorData);
          }
          return res;
        });
      })
    );
    
    const failedDeletions = responses.filter(res => !res.ok).length;
    if (failedDeletions > 0) {
      throw new Error(`Failed to delete ${failedDeletions} emissions`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting emissions:', error);
    return false;
  }
} 