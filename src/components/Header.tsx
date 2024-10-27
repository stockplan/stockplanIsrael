import HeaderClient from "./header-client"
import { createClient } from "@/lib/supabase/server"
import { checkAdmin } from "@/lib/utils"
import { getUser } from "@/utils/supabase-helpers/queries"

const Header = async () => {
  const supabase = createClient()

  const { user } = await getUser(supabase)
  const isAdmin = (user && user.email && checkAdmin(user.email)) || false

  return <HeaderClient user={user} isAdmin={isAdmin} />
}

export default Header
