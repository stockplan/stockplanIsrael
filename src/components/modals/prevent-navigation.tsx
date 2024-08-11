"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { LeavingDialog } from "./leaving-dialog"

type PreventNavigationProps = {
  isDirty: boolean
  saveChanges: () => void
}

export const PreventNavigation = ({
  isDirty,
  saveChanges,
}: PreventNavigationProps) => {
  const [leavingPage, setLeavingPage] = useState(false)
  const router = useRouter()
  const targetUrl = useRef<string>("")

  useEffect(() => {
    const handleNavigationAttempt = (url: string) => {
      if (isDirty) {
        targetUrl.current = url // Capture the intended navigation target
        setLeavingPage(true) // Trigger the dialog
      } else {
        router.push(url) // Proceed if no changes need to be saved
      }
    }

    const handleClick = (event: MouseEvent) => {
      event.preventDefault()
      const href = (event.target as HTMLAnchorElement).href
      handleNavigationAttempt(href)
    }

    const handlePopState = () => {
      handleNavigationAttempt(window.location.href)
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = "Changes you made may not be saved."
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("popstate", handlePopState)
    document
      .querySelectorAll("a")
      .forEach((link) => link.addEventListener("click", handleClick))

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("popstate", handlePopState)
      document
        .querySelectorAll("a")
        .forEach((link) => link.removeEventListener("click", handleClick))
    }
  }, [isDirty, router])

  return (
    <LeavingDialog
      isOpen={leavingPage}
      noCallback={() => {
        setLeavingPage(false)
      }}
      yesCallback={() => {
        saveChanges() // Save changes when user confirms
        router.push(targetUrl.current) // Navigate after saving
        setLeavingPage(false)
      }}
    />
  )
}
