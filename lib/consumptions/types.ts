export interface Consumption {
  id: number
  title: string
  value: number
  type: string
  createdAt: string
  userId?: number
  userName?: string
}

export interface ConsumptionFormValues {
  type: string
  value: string
  userId?: string
} 