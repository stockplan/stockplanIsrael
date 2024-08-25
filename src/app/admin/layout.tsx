import getServerUser from "@/utils/auth-helpers/getServerUser"
import AdminPanelLayout from "./_components/admin-panel-layout"
import { redirect } from "next/navigation"
import { checkAdmin } from "@/lib/utils"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const {
    data: { user },
    error,
  } = await getServerUser()

  if (!user || error) {
    return redirect("/home")
  }

  const isAdmin = user && user.email && checkAdmin(user.email)

  if (!isAdmin) {
    return redirect("/home")
  }

  return <AdminPanelLayout>{children}</AdminPanelLayout>
}
