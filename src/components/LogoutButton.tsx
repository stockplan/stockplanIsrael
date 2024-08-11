"use client"

import { signout } from "@/actions/logout"

interface LogoutButtonProps {
  children?: React.ReactNode
  className?: string
}

export const LogoutButton = ({
  children,
  className = "",
}: LogoutButtonProps) => {
  const onClick = () => {
    signout()
  }

  return (
    <span onClick={onClick} className={`cursor-pointer ${className}`}>
      {children}
    </span>
  )
}
