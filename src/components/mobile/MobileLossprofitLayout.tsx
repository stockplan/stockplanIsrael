"use client"

import React, { useEffect, useRef, useState } from "react"
import { Position } from "@/types"
import MobileAllTickers from "./MobileAllTickers"
import MobileEditorPage from "./MobileEditorPage"
import { useUnsavedChangesContext } from "@/hooks/useUnsavedChangesContext"
import { hasDataChanged } from "@/utils"

import { useLossProfitState } from "./useLossprofitState"

interface MobileLayoutProps {}

const MobileLayout: React.FC<MobileLayoutProps> = ({}) => {
  const { tickersData, selectedTicker, creator } = useLossProfitState()
  const originalDataRef = useRef<Position[]>(tickersData)

  const { unsavedChanges, setUnsavedChanges } = useUnsavedChangesContext()

  // give the option to save when data changed/ might not be needed
  useEffect(() => {
    if (hasDataChanged(tickersData, originalDataRef.current)) {
      setUnsavedChanges(false)
    }
  }, [tickersData])

  const saveChanges = async (changes: Position[]) => {
    if (hasDataChanged(changes, originalDataRef.current)) {
      setUnsavedChanges(false)
      return
    }

    // if (creator && unsavedChanges) {
    //   try {
    //     await axios.post("/api/save", { changes })
    //     originalDataRef.current = changes
    //     setUnsavedChanges(false)
    //     localStorage.removeItem("unsavedChanges")
    //   } catch (error) {
    //     console.error("Failed to save data", error)
    //   }
    // }
  }

  return (
    <div className="h-full bg-gray-900 text-white p-4">
      {selectedTicker === null && creator ? (
        <MobileAllTickers />
      ) : (
        <MobileEditorPage saveChanges={saveChanges} />
      )}
    </div>
  )
}

export default MobileLayout
