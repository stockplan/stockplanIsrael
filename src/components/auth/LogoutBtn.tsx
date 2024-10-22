"use client"

import { signout } from "@/actions/logout"
import { Button } from "../ui/button"
import { useUnsavedChangesContext } from "@/hooks/useUnsavedChangesContext"

interface LogoutBtnProps {}

const LogoutBtn: React.FC<LogoutBtnProps> = ({}) => {
  const { unsavedChanges } = useUnsavedChangesContext()

  const handleLogout = async () => {
    await signout()
  }

  return (
    <form action={signout}>
      <Button variant="ghost" className="border border-white text-white">
        Log out
      </Button>
    </form>
  )
}

export default LogoutBtn
