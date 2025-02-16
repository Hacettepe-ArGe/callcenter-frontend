import useSWR from "swr"
import { useSession } from "next-auth/react"

export interface Worker {
  id: number
  name: string
  department: string
}

export function useWorkers() {
  const { data: session } = useSession()

  const { data, error, isLoading, mutate } = useSWR<Worker[]>(
    session?.user?.token ? `${process.env.NEXT_PUBLIC_API_URL}/api/workers` : null,
    async (url: string) => {
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${session?.user?.token}`
        }
      })
      if (!res.ok) throw new Error("Failed to fetch workers")
      return res.json()
    }
  )

  const createWorker = async (name: string, department: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/workers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.user?.token}`
      },
      body: JSON.stringify({ name, department })
    })
    if (!res.ok) throw new Error("Failed to create worker")
    await mutate()
    return res.json()
  }

  const updateWorker = async (id: number, name: string, department: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/workers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.user?.token}`
      },
      body: JSON.stringify({ name, department })
    })
    if (!res.ok) throw new Error("Failed to update worker")
    await mutate()
    return res.json()
  }

  const deleteWorker = async (id: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/workers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session?.user?.token}`
      }
    })
    if (!res.ok) throw new Error("Failed to delete worker")
    await mutate()
  }

  return {
    workers: data ?? [],
    isLoading,
    error,
    createWorker,
    updateWorker,
    deleteWorker,
    mutate
  }
} 