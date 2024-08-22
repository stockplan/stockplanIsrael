"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type UnsavedChangesContextType =
  | {
      unsavedChanges: boolean
      setUnsavedChanges: (unsaved: boolean) => void
    }
  | undefined

const UnsavedChangesCtx = createContext<UnsavedChangesContextType>(undefined)

type Props = {
  children: ReactNode
}

export const UnsavedChangesProvider = ({ children }: Props) => {
  const [unsavedChanges, setUnsavedChanges] = useState(false)

  return (
    <UnsavedChangesCtx.Provider value={{ unsavedChanges, setUnsavedChanges }}>
      {children}
    </UnsavedChangesCtx.Provider>
  )
}

export const useUnsavedChangesContext = () => {
  const ctx = useContext(UnsavedChangesCtx)
  if (ctx === undefined) {
    throw new Error(
      "useUnsavedChangesContext must be used within a UnsavedChangesProvider"
    )
  }
  return ctx
}
