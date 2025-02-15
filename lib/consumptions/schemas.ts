import * as z from "zod"

export const businessFormSchema = z.object({
  type: z.string(),
  value: z.string(),
})

export const userFormSchema = z.object({
  userId: z.string(),
  type: z.string(),
  value: z.string(),
}) 