import * as z from "zod"

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
})

export const RegisterSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const ContactMessageSchema = z.object({
  email: z
    .string()
    .email({
      message: "Invalid email address",
    })
    .max(30, {
      message: "Email cannot exceed 30 characters",
    }),
  firstName: z
    .string()
    .min(1, {
      message: "First name is required",
    })
    .max(12, {
      message: "First name cannot exceed 12 characters",
    }),
  lastName: z
    .string()
    .min(1, {
      message: "Last name is required",
    })
    .max(12, {
      message: "Last name cannot exceed 12 characters",
    }),
  description: z
    .string()
    .min(1, {
      message: "Description is required",
    })
    .max(500, {
      message: "Description cannot exceed 4 lines or 500 characters",
    }),
})

export interface Position {
  _id?: string
  creator?: string
  ticker: string
  positionType: string
  quantity: number
  actualPrice: number
  askPrice: number
  cost: number
  exitPrice: number
  expectedProfit: number
  expectedProfitPercent: number
  stopLoss: number
  expectedLoss: number
  expectedLossPercent: number
  daysLeft?: number
  entryDate?: string
}
