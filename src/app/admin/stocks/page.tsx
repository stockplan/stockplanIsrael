import { createClient } from "@/lib/supabase/server"
import { checkAdmin } from "@/lib/utils"
import { getUser } from "@/utils/supabase-helpers/queries"
import { redirect } from "next/navigation"
import React from "react"
import StocksGrid from "../_components/stocks-grid"

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_VERCEL_URL
    : typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000"

const StocksPage = async ({}) => {
  const supabase = createClient()

  const { user } = await getUser(supabase)
  if (!user || !user.email) {
    return redirect("/home")
  }
  if (!checkAdmin(user.email)) {
    return redirect("/home")
  }
  const response = await fetch(`${BASE_URL}/api/position`)
  const data = (await response.json()) || []

  return (
    <div className="StocksPage">
      <StocksGrid positions={data.data} />
    </div>
  )
}

export default StocksPage
