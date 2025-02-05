"use client"

import { useEffect } from "react"
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { Input } from "../ui/input"
import { Position } from "@/types"
import {
  calculateCost,
  calculateExitPriceFromProfitPercent,
  calculateExpectedLoss,
  calculateExpectedLossPercent,
  calculateExpectedProfit,
  calculateExpectedProfitPercent,
  calculateStopLossFromLossPercent,
} from "@/utils/calc-helpers"
import CurrencyInput from "react-currency-input-field"
import useSWR, { mutate } from "swr"
import { useLossProfitState } from "./useLossprofitState"
import { Button } from "../ui/button"
import axios from "axios"
import Logo from "../logo"
import { getEmptyRow } from "@/lib/utils"
import { ToastAction } from "@radix-ui/react-toast"
import { useToast } from "../ui/use-toast"

interface MobileMainTickerProps {}

const fetcher = async (url: string, currTicker: string) => {
  const res = await axios.get(`${url}?ticker=${currTicker}`)
  return res.data
}

export const MobileMainTicker: React.FC<MobileMainTickerProps> = () => {
  const { selectedTicker, updateSelectedTicker, deleteTicker, creator, tickersData } = useLossProfitState()
  const defaultValues: Position = selectedTicker ?? getEmptyRow()
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { isDirty, dirtyFields },
  } = useForm<Position>({ defaultValues })

  const { toast } = useToast()

  const ticker = watch("ticker")
  const positionType = watch("positionType")

  const { data: fetchedPrice, error } = useSWR(
    ticker ? [`/api/tickerPrice`, ticker] : null,
    ([url, currTicker]) => fetcher(url, currTicker),
    {
      fallbackData: selectedTicker?.actualPrice,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      refreshInterval: 2 * 60 * 1000,
    }
  )

  useEffect(() => {
    if (!ticker || error) {
      setValue("actualPrice", 0)
    } else if (fetchedPrice && fetchedPrice.fetchedPrice) {
      setValue("actualPrice", parseFloat(fetchedPrice.fetchedPrice.toFixed(2)))
    }
  }, [fetchedPrice, error, ticker, setValue])

  const validateNewTicker = (tickerToSave: Position) => {
    const validationToast = {
      title: "",
      description: "",
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    }

    if (tickerToSave) {
      if (!tickerToSave.ticker) {
        validationToast.title = "Missing Ticker Symbol"
        validationToast.description = "Please enter a ticker symbol."
      } else if (Number(tickerToSave.askPrice) <= 0) {
        validationToast.title = "Ask Price Required"
        validationToast.description = "Please enter an ask price greater than 0."
      } else if (Number(tickerToSave.quantity) <= 0) {
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

  const updateCalculations = (changedField: keyof Position) => {
    const values = getValues()

    const askPrice = Number(values.askPrice) || 0
    const quantity = Number(values.quantity) || 0
    const exitPrice = Number(values.exitPrice) || 0
    const stopLoss = Number(values.stopLoss) || 0
    const profitPercentValue = Number(values.expectedProfitPercent) || 0
    const lossPercentValue = Number(values.expectedLossPercent) || 0

    const updatedCost = calculateCost(askPrice, quantity)
    setValue("cost", updatedCost)

    if (["askPrice", "quantity", "exitPrice"].includes(changedField)) {
      let expProfit = calculateExpectedProfit(values.positionType, askPrice, exitPrice, quantity)
      if (expProfit < 0) expProfit = 0
      const expProfitPercent = calculateExpectedProfitPercent(expProfit, updatedCost)
      setValue("expectedProfit", expProfit)
      setValue("expectedProfitPercent", expProfitPercent)
    }

    if (["askPrice", "quantity", "stopLoss"].includes(changedField)) {
      const expLoss = calculateExpectedLoss(values.positionType, askPrice, stopLoss, quantity)
      const expLossPercent = calculateExpectedLossPercent(expLoss, updatedCost)
      setValue("expectedLoss", expLoss)
      setValue("expectedLossPercent", expLossPercent)
    }

    if (changedField === "expectedProfitPercent") {
      const targetProfit = (profitPercentValue * updatedCost) / 100
      const newExitPrice = calculateExitPriceFromProfitPercent(values.positionType, askPrice, targetProfit, quantity)
      setValue("exitPrice", newExitPrice)
      setValue("expectedProfit", targetProfit)
    }

    if (changedField === "expectedLossPercent") {
      const newExpectedLoss = ((Math.abs(lossPercentValue) * updatedCost) / 100) * -1
      const newStopLoss = calculateStopLossFromLossPercent(newExpectedLoss, quantity, askPrice)
      setValue("expectedLoss", newExpectedLoss)
      setValue("stopLoss", newStopLoss)
    }
  }

  //prettier-ignore
  const handlePositionTypeChange = (type: "buy" | "sell") => {
    const values = getValues()
    const askPrice = Number(values.askPrice) || 0
    const quantity = Number(values.quantity) || 0
    const exitPrice = Number(values.exitPrice) || 0
    const stopLoss = Number(values.stopLoss) || 0

    const updatedCost = calculateCost(askPrice, quantity)
    const expProfit = calculateExpectedProfit(type, askPrice, exitPrice, quantity)
    const expProfitPercent = calculateExpectedProfitPercent(expProfit, updatedCost)
    const expLoss = calculateExpectedLoss(type, askPrice, stopLoss, quantity)
    const expLossPercent = calculateExpectedLossPercent(expLoss, updatedCost)

    setValue("positionType", type)
    setValue("expectedProfit", expProfit)
    setValue("expectedProfitPercent", expProfitPercent)
    setValue("expectedLoss", expLoss)
    setValue("expectedLossPercent", expLossPercent)
  }

  const onSubmit: SubmitHandler<Position> = async (data) => {
    if (!validateNewTicker(data)) return
    const updatedTickers = tickersData.map((item) => (item._id === data._id ? data : item))

    await updateSelectedTicker(updatedTickers)
  }

  return (
    <>
      <div>
        <Logo isNavigate={false} />
        <h2 className="text-xl font-semibold mt-2" onClick={() => console.log(dirtyFields, isDirty, defaultValues)}>
          Quick Profit & Loss Calculator
        </h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-4 p-4 border border-gray-700 rounded-lg">
          <div className="mb-2">
            <div className="border border-gray-600 p-2 rounded-md flex justify-between items-center">
              <Controller
                control={control}
                name="ticker"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Ticker"
                    className="w-1/2 border-none bg-transparent focus:outline-none text-white"
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    onBlur={() => mutate(["/api/tickerPrice", getValues("ticker")])}
                  />
                )}
              />
              <Controller
                control={control}
                name="actualPrice"
                render={({ field }) => (
                  <CurrencyInput
                    {...field}
                    readOnly
                    placeholder="--"
                    className="w-1/2 text-right border-none bg-transparent focus:outline-none text-white"
                    suffix="$"
                    decimalsLimit={2}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-between mb-4">
            <button
              type="button"
              onClick={() => handlePositionTypeChange("buy")}
              className={`flex-1 py-1 px-2 ${
                positionType === "buy" ? "bg-green-500" : "bg-gray-400"
              } text-white text-sm`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => handlePositionTypeChange("sell")}
              className={`flex-1 py-1 px-2 ${
                positionType === "sell" ? "bg-red-500" : "bg-gray-400"
              } text-white text-sm`}
            >
              Sell
            </button>
          </div>

          <div className="mb-2">
            <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
              <label className="text-sm">Quantity</label>
              <Controller
                control={control}
                name="quantity"
                render={({ field }) => (
                  <CurrencyInput
                    placeholder="0"
                    decimalsLimit={0}
                    onBlur={() => dirtyFields.quantity ?? updateCalculations("quantity")}
                    className="w-1/2 border-none bg-transparent focus:outline-none text-right"
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value === 0 ? "" : String(field.value)}
                  />
                )}
              />
            </div>
          </div>

          <div className="mb-2">
            <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
              <label className="text-sm">Ask Price</label>
              <Controller
                control={control}
                name="askPrice"
                render={({ field }) => (
                  <CurrencyInput
                    placeholder="0.00"
                    suffix="$"
                    decimalsLimit={2}
                    onBlur={() => dirtyFields.askPrice ?? updateCalculations("askPrice")}
                    className="w-1/2 border-none bg-transparent focus:outline-none text-right"
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value === 0 ? "" : String(field.value)}
                  />
                )}
              />
            </div>
          </div>

          <div className="mb-2">
            <div className="p-2 rounded-md flex items-center justify-between">
              <label className="text-sm">Cost</label>
              <Controller
                control={control}
                name="cost"
                render={({ field }) => (
                  <CurrencyInput
                    {...field}
                    readOnly
                    placeholder="--"
                    suffix="$"
                    decimalsLimit={2}
                    className="w-1/2 border-none bg-transparent focus:outline-none text-white text-right"
                    value={field.value || ""}
                  />
                )}
              />
            </div>
          </div>

          <div className="mb-2">
            <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
              <label className="text-sm">Exit Price</label>
              <Controller
                control={control}
                name="exitPrice"
                render={({ field }) => (
                  <CurrencyInput
                    placeholder="0.00"
                    suffix="$"
                    decimalsLimit={2}
                    onBlur={() => updateCalculations("exitPrice")}
                    className="w-1/2 border-none bg-transparent focus:outline-none text-right"
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value === 0 ? "" : String(field.value)}
                  />
                )}
              />
            </div>
          </div>

          <div className="mb-2">
            <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
              <label className="text-sm">Expected Profit %</label>
              <Controller
                control={control}
                name="expectedProfitPercent"
                render={({ field }) => (
                  <CurrencyInput
                    placeholder="0.00"
                    suffix="%"
                    decimalsLimit={2}
                    onBlur={() => updateCalculations("expectedProfitPercent")}
                    className="w-1/2 border-none bg-transparent focus:outline-none text-right"
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value === 0 ? "" : String(field.value)}
                  />
                )}
              />
            </div>
          </div>

          <div className="mb-2">
            <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
              <label className="text-sm">Stop Loss</label>
              <Controller
                control={control}
                name="stopLoss"
                render={({ field }) => (
                  <CurrencyInput
                    placeholder="0.00"
                    suffix="$"
                    decimalsLimit={2}
                    onBlur={() => updateCalculations("stopLoss")}
                    className="w-1/2 border-none bg-transparent focus:outline-none text-right"
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value === 0 ? "" : String(field.value)}
                  />
                )}
              />
            </div>
          </div>

          <div className="mb-2">
            <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
              <label className="text-sm">Expected Loss %</label>
              <Controller
                control={control}
                name="expectedLossPercent"
                render={({ field }) => (
                  <CurrencyInput
                    placeholder="0.00"
                    suffix="%"
                    decimalsLimit={2}
                    onBlur={() => updateCalculations("expectedLossPercent")}
                    className="w-1/2 border-none bg-transparent focus:outline-none text-right"
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value === 0 ? "" : String(field.value)}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-between mt-4 text-lg">
            <div className="text-green-500">Exp. profit: {watch("expectedProfit")}$</div>
            <div className="text-red-500">Exp. Loss: {watch("expectedLoss")}$</div>
          </div>
        </div>

        {creator && (
          <div className="mt-4 flex justify-center">
            <Button type="submit" className="bg-blue-600 w-full" disabled={!isDirty}>
              Save Changes
            </Button>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          {creator && (
            <Button type="button" onClick={() => deleteTicker()} className="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          )}
          <Button type="button" onClick={() => reset(defaultValues)} className="bg-gray-600 hover:bg-gray-700">
            Reset
          </Button>
        </div>
      </form>
    </>
  )
}

export default MobileMainTicker
