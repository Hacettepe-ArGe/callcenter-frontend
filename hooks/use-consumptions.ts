import useSWR from "swr"
import { Consumption } from "@/app/dashboard/consumptions/columns"
import { useSession } from "next-auth/react"

export function useConsumptions() {
  const { data: session } = useSession()
  
  const { data, error, isLoading, mutate } = useSWR<Consumption[]>(
    session?.user?.token ? `${process.env.NEXT_PUBLIC_API_URL}/api/emissions/emission` : null,
    async (url: string) => {
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${session?.user?.token}`
        }
      })
      if (!res.ok) throw new Error("Failed to fetch consumptions")
      const data = await res.json()
      return data.data
    }
  )

  return {
    consumptions: data ?? [],
    isLoading,
    error,
    mutate
  }
} 