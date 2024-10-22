import { SupabaseClient } from "@supabase/supabase-js"
import { cache } from "react"

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return { user, error }
})

export const getUserDetails = cache(async (supabase: SupabaseClient) => {
  const { data: userDetails } = await supabase
    .from("users")
    .select("*")
    .single()

  return userDetails
})

export const getContactMessages = cache(async (supabase: SupabaseClient) => {
  const { data } = await supabase.from("contacts").select("*")
  return data
})
