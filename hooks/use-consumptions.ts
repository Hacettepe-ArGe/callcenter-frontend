import useSWR from "swr"
import { Consumption } from "@/app/dashboard/consumptions/columns"

export function useConsumptions() {
  const { data, error, isLoading, mutate } = useSWR<Consumption[]>(
    "/api/consumptions",
    async (url: string) => {
      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to fetch consumptions")
      return res.json()
    }
  )

  return {
    consumptions: data ?? [],
    isLoading,
    error,
    mutate
  }
} 