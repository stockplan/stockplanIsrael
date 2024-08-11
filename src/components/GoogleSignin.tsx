"use client"

import { FcGoogle } from "react-icons/fc"
import { Button } from "./ui/button"
import { createClient } from "@/lib/supabase/client"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { getURL } from "@/utils/helpers"

const GoogleSignin = () => {
  const signinWithGoogle = async () => {
    try {
      const supabase = createClient()

      const redirectUrl = getURL(
        `/auth/callback?next=${DEFAULT_LOGIN_REDIRECT}`
      )
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

  return (
    <Button
      onClick={signinWithGoogle}
      variant="outline"
      className="h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 flex items-center justify-center space-x-4 bg-white dark:bg-gray-800 shadow-sm"
    >
      <FcGoogle className="h-5 w-5" />
      <span className="block font-semibold tracking-wide text-gray-700 dark:text-white text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">
        Continue with Google
      </span>
    </Button>
  )
}

export default GoogleSignin
