"use client"

import { FcGoogle } from "react-icons/fc"
import { Button } from "./ui/button"
import { createClient } from "@/lib/supabase/client"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { useState } from "react"
import { RiLoader4Fill as Loader } from "react-icons/ri"

const BASE_URL =
  process.env.NODE_ENV !== "development"
    ? process.env.NEXT_PUBLIC_BASE_URL
    : "http://localhost:3000"

const GoogleSignin = () => {
  const [loading, setLoading] = useState(false)

  const signinWithGoogle = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      await new Promise((resolve) => setTimeout(resolve, 500))

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${BASE_URL}/auth/callback?next=${DEFAULT_LOGIN_REDIRECT}`,
        },
      })
      if (error) throw error
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={signinWithGoogle}
      variant="outline"
      className="h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 flex items-center justify-center space-x-4 bg-white dark:bg-gray-800 shadow-sm"
      disabled={loading} // Disable button while loading
    >
      {loading ? (
        <Loader className="animate-spin h-5 w-5 text-gray-700 dark:text-white" />
      ) : (
        <>
          <FcGoogle className="h-5 w-5" />
          <span className="block font-semibold tracking-wide text-gray-700 dark:text-white text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">
            Continue with Google
          </span>
        </>
      )}
    </Button>
  )
}

export default GoogleSignin
