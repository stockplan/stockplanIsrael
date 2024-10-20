"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function RouteChangeListener() {
  const pathname = usePathname()
  const [changes, setChanges] = useState(0)

  useEffect(() => {
    // console.log(`Route changed to: ${pathname}`)
    setChanges((prev) => prev + 1)
  }, [pathname])

  useEffect(() => {
    console.log(changes)
  }, [changes])

  return <></>
}
