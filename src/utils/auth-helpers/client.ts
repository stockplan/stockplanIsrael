"use client"

import { createClient } from "@/lib/supabase/client"
import { getURL } from "../helpers"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"

export const signinWithGoogle = async () => {
  try {
    const supabase = createClient()

    const redirectUrl = getURL(`/auth/callback?next=${DEFAULT_LOGIN_REDIRECT}`)
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    })
  } catch (error) {
    console.error(error)
  }
}
