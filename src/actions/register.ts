"use server"

import { createClient } from "@/lib/supabase/server"
import { RegisterSchema } from "@/schemas"
import { headers } from "next/headers"
import * as z from "zod"

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const origin = (await headers()).get("origin")
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  try {
    const supabase = await createClient()

    const { email, password } = validatedFields.data

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      console.log(error)

      return { error: error.message }
    }

    return { success: "Check email to continue sign in process" }
  } catch (error) {
    console.log(error)
  }
}
