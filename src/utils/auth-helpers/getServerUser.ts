"use server"

import { createClient } from "../../lib/supabase/server"

export default async function getServerUser() {
  const supabase = await createClient()
  return await supabase.auth.getUser()
}
