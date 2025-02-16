import useSWR from "swr"
import { useSession } from "next-auth/react"

export interface EmissionTypes {
  [key: string]: string[]
}

export function useEmissionTypes() {
  const { data: session } = useSession()
  
  const { data, error, isLoading } = useSWR<EmissionTypes>(
    session?.user?.token ? `${process.env.NEXT_PUBLIC_API_URL}/api/emissions/types` : null,
    async (url: string) => {
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${session?.user?.token}`
        }
      })
      if (!res.ok) throw new Error("Failed to fetch emission types")
      return res.json()
    }
  )

  return {
    types: data ?? {},
    isLoading,
    error
  }
} 