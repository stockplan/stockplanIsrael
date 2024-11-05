import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/utils/supabase-helpers/queries"
import { redirect } from "next/navigation"

export default async function CalculatorPage() {
  const supabase = await createClient()

  const { user, error } = await getUser(supabase)

  if (error && user) return redirect("/home")
}
