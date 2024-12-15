"use client"

import { Position } from "@/types"
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react"
import { useToast } from "../ui/use-toast"
import { ToastAction } from "../ui/toast"
import { getEmptyRow } from "@/lib/utils"
import { hasDataChanged } from "@/utils"
import axios from "axios"
import { useUnsavedChangesContext } from "@/hooks/useUnsavedChangesContext"
import { useWarnIfUnsavedChanges } from "@/hooks/useWarnIfUnsavedChanges"

type Props = {
  tickersData: Position[]
  addNewTicker: () => void
  selectedTicker: Position | null
  deleteTicker: () => void
  handleTickerSelect: (ticker: Position | null) => void
  creator: string | null
  saveChanges: (changes: Position[]) => Promise<void>
}

const LossProfitStateContext = createContext<Props | null>(null)

const LossProfitStateProvider = ({
  children,
  initialValue,
  creator,
}: PropsWithChildren & {
  initialValue: Position[]
  creator: string | null
}) => {
  const [tickersData, setTickersData] = useState<Position[]>(initialValue)
  const [selectedTicker, setSelectedTicker] = useState<Position | null>(null)

  const { unsavedChanges, setUnsavedChanges } = useUnsavedChangesContext()

  useWarnIfUnsavedChanges(unsavedChanges, !!creator)

  const AUTO_SAVE_DELAY = 1000

  // useEffect(() => {
  //   const autoSaveTimer = setTimeout(() => {
  //     if (unsavedChanges) {
  //       saveChanges(tickersData)
  //     }
  //   }, AUTO_SAVE_DELAY)

  //   return () => clearTimeout(autoSaveTimer)
  // }, [tickersData, unsavedChanges])

  useEffect(() => {
    if (initialValue) {
      setTickersData(initialValue)
    }
  }, [initialValue])

  const { toast } = useToast()

  const addNewTicker = () => {
    const maxTickers = 10
    if (!creator || tickersData.length >= maxTickers) {
      if (tickersData.length >= maxTickers) {
        toast({
          description: `Maximum of ${maxTickers} rows allowed.`,
          variant: "destructive",
        })
      }
      return
    }

    if (selectedTicker && !validateNewTicker(selectedTicker)) return

    // Add a new empty ticker
    const newTicker = getEmptyRow(creator)
    setSelectedTicker(newTicker)

    const updatedData = [...tickersData, newTicker]
    setTickersData(updatedData)
  }

  const validateNewTicker = (lastTicker: Position) => {
    const validationToast = {
      title: "",
      description: "",
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    }

    if (lastTicker) {
      // Validate ticker
      if (!lastTicker.ticker) {
        validationToast.title = "Missing Ticker Symbol"
        validationToast.description = "Please enter a ticker symbol."
      }

      // Validate askPrice
      else if (lastTicker.askPrice === 0) {
        validationToast.title = "Ask Price Required"
        validationToast.description = "Please enter an ask price greater than 0."
      }

      // Validate quantity
      else if (lastTicker.quantity === 0) {
        validationToast.title = "Quantity Needed"
        validationToast.description = "Please enter a quantity greater than 0."
      }
    }

    if (validationToast.description) {
      toast(validationToast)
      return false
    }
    return true
  }

  const handleTickerSelect = (ticker: Position | null) => {
    setSelectedTicker(ticker)
  }

  const deleteTicker = () => {
    if (!selectedTicker) return
    const updatedTickers = tickersData.filter((ticker) => ticker._id !== selectedTicker._id)
    setTickersData(updatedTickers)
    setSelectedTicker(null)
    setUnsavedChanges(true)
    saveChanges(updatedTickers)
  }

  const saveChanges = async (changes: Position[]) => {
    if (hasDataChanged(changes, tickersData)) {
      setUnsavedChanges(false)
      return
    }
    console.log({ changes })

    if (creator && unsavedChanges) {
      try {
        await axios.post("/api/save", { changes })
        setUnsavedChanges(false)
      } catch (error) {
        console.error("Failed to save data", error)
      }
    }
  }

  const value = {
    tickersData,
    addNewTicker,
    selectedTicker,
    deleteTicker,
    handleTickerSelect,
    creator,
    saveChanges,
  }
  return <LossProfitStateContext value={value}>{children}</LossProfitStateContext>
}

export default LossProfitStateProvider

export const useLossProfitState = () => {
  const context = useContext(LossProfitStateContext)
  if (!context) {
    throw new Error("please provide context")
  }

  return context
}
