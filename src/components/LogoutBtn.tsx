"use client"

import { signout } from "@/actions/logout"
import { Button } from "./ui/button"

interface LogoutBtnProps {}

const LogoutBtn: React.FC<LogoutBtnProps> = ({}) => {
  const handleLogout = async () => {
    await signout()
  }

  return (
    <Button
      variant="ghost"
      className="border border-white text-white"
      onClick={handleLogout}
    >
      Log out
    </Button>
  )
}

export default LogoutBtn
