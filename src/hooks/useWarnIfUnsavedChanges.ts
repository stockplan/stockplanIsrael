"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime"

export const useWarnIfUnsavedChanges = (unsaved: boolean, isUser: boolean) => {
  const router = useRouter()

  const handleAnchorClick: EventListener = (event) => {
    const e = event as MouseEvent
    if (e.button !== 0) return // only handle left-clicks
    const targetUrl = (e.currentTarget as HTMLAnchorElement).href
    const currentUrl = window.location.href
    if (targetUrl !== currentUrl && window.onbeforeunload) {
      // @ts-ignore
      const res = window.onbeforeunload()
      if (!res) e.preventDefault()
    }
  }

  const addAnchorListeners = () => {
    const anchorElements = document.querySelectorAll("a[href]")
    anchorElements.forEach((anchor) =>
      anchor.addEventListener("click", handleAnchorClick)
    )
  }

  useEffect(() => {
    if (!isUser) return
    const mutationObserver = new MutationObserver(addAnchorListeners)

    mutationObserver.observe(document.body, { childList: true, subtree: true })

    addAnchorListeners()

    return () => {
      mutationObserver.disconnect()
      const anchorElements = document.querySelectorAll("a[href]")
      anchorElements.forEach((anchor) =>
        anchor.removeEventListener("click", handleAnchorClick)
      )
    }
  }, [isUser])

  useEffect(() => {
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = "" // required for Chrome
    }

    const handlePopState = (e: PopStateEvent) => {
      if (unsaved && isUser) {
        const confirmLeave = window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        )
        if (!confirmLeave) {
          e.preventDefault()
          window.history.pushState(null, "", window.location.href)
        }
      }
    }

    if (unsaved && isUser) {
      window.addEventListener("beforeunload", beforeUnloadHandler)
      window.addEventListener("popstate", handlePopState)
    } else {
      window.removeEventListener("beforeunload", beforeUnloadHandler)
      window.removeEventListener("popstate", handlePopState)
    }

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler)
      window.removeEventListener("popstate", handlePopState)
    }
  }, [unsaved, isUser])

  useEffect(() => {
    const originalPush = router.push

    router.push = (url: string, options?: NavigateOptions) => {
      if (unsaved && isUser) {
        const confirmLeave = window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        )
        if (confirmLeave) {
          originalPush(url, options)
        }
      } else {
        originalPush(url, options)
      }
    }

    return () => {
      router.push = originalPush
    }
  }, [router, unsaved])
}
