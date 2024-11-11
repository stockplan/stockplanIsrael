"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { ContactMessageSchema } from "@/schemas"
import { getURL } from "@/utils/helpers"
import axios from "axios"

import { z } from "zod"

export async function sendEmailToAdmin(
  userMessage: z.infer<typeof ContactMessageSchema>
) {
  const validatedUserMessage = ContactMessageSchema.safeParse(userMessage)

  if (!validatedUserMessage.success) {
    console.log(validatedUserMessage.error)
    return { error: validatedUserMessage.error.message }
  }

  const { firstName, lastName, description, email } = validatedUserMessage.data

  const toInsetContact = {
    first_name: firstName,
    last_name: lastName,
    email,
    description,
  }

  const supabase = await createClient()
  const { error } = await supabase.from("contacts").insert(toInsetContact)
  if (error) throw error
  return { success: true }
}

export async function getUsers() {
  const supabase = await createAdminClient()

  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers()

  if (error) {
    throw error
  }

  return users
}
