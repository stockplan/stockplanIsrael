"use server"

import { LoginSchema } from "@/schemas"
import * as z from "zod"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const supabase = await createClient()

  const data = validatedFields.data

  try {
    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
      console.log(error)

      return { error: error.message }
    }

    revalidatePath("/home/calculator/[type]", "page")
    redirect("/home/calculator/lossprofit")

    return { success: "Login success" }
  } catch (error) {
    throw error
  }
}
