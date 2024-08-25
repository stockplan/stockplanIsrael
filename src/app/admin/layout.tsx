import AdminPanelLayout from "./_components/admin-panel-layout"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>
}
