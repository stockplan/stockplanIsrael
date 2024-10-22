import AdminPanelLayout from "./_components/admin-panel-layout"
import { redirect } from "next/navigation"
import { checkAdmin } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"
import { getUser, getUserDetails } from "@/utils/supabase-helpers/queries"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const [{ user, error }, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase),
  ])

  const isAdmin = user && user.email && checkAdmin(user.email)

  if (!user || error || !isAdmin) {
    return redirect("/home")
  }

  return (
    <AdminPanelLayout user={user} userDetails={userDetails}>
      {children}
    </AdminPanelLayout>
  )
}
