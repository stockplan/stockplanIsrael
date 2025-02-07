"use client"

import { Position } from "@/types"
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react"
import { useToast } from "../ui/use-toast"
import { ToastAction } from "../ui/toast"
import axios from "axios"
import { getEmptyRow } from "@/lib/utils"

type Props = {
  tickersData: Position[]
  addNewTicker: () => void
  selectedTicker: Position | null
  deleteTicker: () => void
  handleTickerSelect: (ticker: Position | null) => void
  creator: string | null
  updateSelectedTicker: (changes: Position[]) => Promise<void>
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

  const { toast } = useToast()

  const addNewTicker = async () => {
    const maxTickers = 10
    if (!creator) return
    if (tickersData.length >= maxTickers) {
      toast({
        description: `Maximum of ${maxTickers} rows allowed.`,
        variant: "destructive",
      })
      return
    }

    try {
      // Send a request to the API to create a new ticker (without sending the entire ticker object)
      const response = await axios.post("/api/save/add-one")

      if (!response.data || !response.data.newTicker) {
        throw new Error("Failed to save ticker")
      }

      const savedTicker = response.data.newTicker

      setSelectedTicker(savedTicker)
      setTickersData((prev) => [...prev, savedTicker])
    } catch (error) {
      console.error("Failed to add new ticker:", error)
      toast({
        description: "Unable to add ticker. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTickerSelect = (ticker: Position | null) => {
    setSelectedTicker(ticker)
  }

  const deleteTicker = async () => {
    if (!selectedTicker) return
    const updatedTickers = tickersData.filter((ticker) => ticker._id !== selectedTicker._id)
    setTickersData(updatedTickers)
    setSelectedTicker(null)
    await updateSelectedTicker(updatedTickers)
  }

  const updateSelectedTicker = async (changes: Position[]) => {
    if (!creator) return
    try {
      setTickersData(changes)
      setSelectedTicker(null)
      await axios.post("/api/save", { changes })
    } catch (error) {
      console.error("Failed to save data", error)
    }
  }

  const value = {
    tickersData,
    addNewTicker,
    selectedTicker,
    deleteTicker,
    handleTickerSelect,
    creator,
    updateSelectedTicker,
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
