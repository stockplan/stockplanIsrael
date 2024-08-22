"use client"

import { signout } from "@/actions/logout"
import { Button } from "./ui/button"
import { useUnsavedChangesContext } from "@/hooks/useUnsavedChangesContext"

interface LogoutBtnProps {}

const LogoutBtn: React.FC<LogoutBtnProps> = ({}) => {
  const { unsavedChanges } = useUnsavedChangesContext()

  const handleLogout = async () => {
    await signout()
  }

  return (
    <Button
      disabled={unsavedChanges}
      variant="ghost"
      className="border border-white text-white"
      onClick={handleLogout}
    >
      Log out
    </Button>
  )
}

export default LogoutBtn
