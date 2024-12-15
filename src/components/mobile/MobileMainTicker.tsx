"use client"

import React, { useEffect } from "react"
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
import AddTickerBtn from "./AddTickerBtn"
import { Button } from "../ui/button"
import axios from "axios"
import Logo from "../logo"
import { getEmptyRow } from "@/lib/utils"

interface MobileMainTickerProps {}

const fetcher = async (url: string, currTicker: string) => {
  const res = await axios.get(`${url}?ticker=${currTicker}`)
  return res.data
}

export const MobileMainTicker: React.FC<MobileMainTickerProps> = () => {
  const { selectedTicker, saveChanges, deleteTicker, creator, tickersData } = useLossProfitState()
  const defaultValues: Position = selectedTicker ?? getEmptyRow()
  const { control, handleSubmit, setValue, getValues, reset, watch } = useForm<Position>({ defaultValues })

  const ticker = watch("ticker") // watch ticker changes
  const positionType = watch("positionType") // watch positionType changes for immediate UI updates

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
    if (error || !ticker) {
      setValue("actualPrice", 0)
    } else if (fetchedPrice && fetchedPrice.fetchedPrice && ticker) {
      setValue("actualPrice", parseFloat(fetchedPrice.fetchedPrice))
    }
  }, [fetchedPrice, error, ticker])

  const handleFieldBlur = (field: keyof Position) => {
    const values = getValues()
    const updatedCost = calculateCost(values.askPrice, values.quantity)

    const expectedProfit = calculateExpectedProfit(
      values.positionType,
      values.askPrice,
      values.exitPrice,
      values.quantity
    )
    const expectedProfitPercent = calculateExpectedProfitPercent(expectedProfit, updatedCost)

    const expectedLoss = calculateExpectedLoss(values.positionType, values.askPrice, values.stopLoss, values.quantity)
    const expectedLossPercent = calculateExpectedLossPercent(expectedLoss, updatedCost)

    switch (field) {
      case "quantity":
      case "askPrice":
        setValue("cost", updatedCost)
        setValue("expectedProfit", expectedProfit)
        setValue("expectedProfitPercent", expectedProfitPercent)
        setValue("expectedLoss", expectedLoss)
        setValue("expectedLossPercent", expectedLossPercent)
        break

      case "exitPrice":
        setValue("expectedProfit", expectedProfit)
        setValue("expectedProfitPercent", expectedProfitPercent)
        break

      case "expectedProfitPercent":
        const targetProfit = (values.expectedProfitPercent * updatedCost) / 100
        const newExitPrice = calculateExitPriceFromProfitPercent(
          values.positionType,
          values.askPrice,
          targetProfit,
          values.quantity
        )
        setValue("exitPrice", newExitPrice)
        setValue("expectedProfit", targetProfit)
        break

      case "stopLoss":
        setValue("expectedLoss", expectedLoss)
        setValue("expectedLossPercent", expectedLossPercent)
        break

      case "expectedLossPercent":
        // Calculate new values based on loss %
        const lossPercentValue = values.expectedLossPercent
        const newExpectedLoss = ((Math.abs(lossPercentValue) * updatedCost) / 100) * -1
        const newStopLoss = calculateStopLossFromLossPercent(newExpectedLoss, values.quantity, values.askPrice)
        setValue("expectedLoss", newExpectedLoss)
        setValue("stopLoss", newStopLoss)
        break
    }
  }

  const handlePositionTypeChange = (type: "buy" | "sell") => {
    setValue("positionType", type)
    // handleFieldBlur("quantity")
  }

  const onSubmit: SubmitHandler<Position> = async (data) => {
    //  saveChanges(data)
    const updatedTickers = tickersData.map((item) => {
      if (item._id === data._id) return data
      return item
    })
    await saveChanges(updatedTickers)
  }

  return (
    <>
      <div>
        <Logo isNavigate={false} />
        <h2 className="text-xl font-semibold mt-2" onClick={() => console.log(getValues())}>
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
                    onBlur={() => {
                      handleFieldBlur("ticker")
                      mutate(["/api/tickerPrice", getValues("ticker")])
                    }}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase()
                      field.onChange(val)
                    }}
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
                    // allowEmptyValue={true}
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
              className={`flex-1 ${positionType === "sell" ? "bg-red-500" : "bg-gray-400"} text-white text-sm`}
            >
              Sell
            </button>
          </div>

          {/* Quantity */}
          <div className="mb-2">
            <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
              <label className="text-sm mr-2">Quantity</label>
              <Controller
                control={control}
                name="quantity"
                render={({ field }) => (
                  <CurrencyInput
                    // allowEmptyValue={true}
                    placeholder="0"
                    decimalsLimit={0}
                    onBlur={() => handleFieldBlur("quantity")}
                    className="w-1/2 border-none bg-transparent focus:outline-none text-right"
                    onValueChange={(value) => field.onChange(value ? parseFloat(value) : 0)}
                    value={field.value === 0 ? "" : field.value}
                  />
                )}
              />
            </div>
          </div>

          {/* Ask Price */}
          <div className="mb-2">
            <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
              <label className="text-sm mr-2">Ask Price</label>
              <Controller
                control={control}
                name="askPrice"
                render={({ field }) => (
                  <CurrencyInput
                    // allowEmptyValue={true}
                    placeholder="0.00"
                    suffix="$"
                    onBlur={() => handleFieldBlur("askPrice")}
                    decimalsLimit={2}
                    className="w-1/2 border-none bg-transparent focus:outline-none text-right"
                    onValueChange={(value) => field.onChange(value ? parseFloat(value) : 0)}
                    value={field.value === 0 ? "" : field.value}
                  />
                )}
              />
            </div>
          </div>

          {/* Cost */}
          <div className="mb-2">
            <div className="p-2 rounded-md flex items-center justify-between">
              <label className="text-sm mr-2">Cost</label>
              <Controller
                control={control}
                name="cost"
                render={({ field }) => (
                  <CurrencyInput
                    {...field}
                    readOnly
                    // allowEmptyValue={true}
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

          {/* Exit Price */}
          <div className="mb-2">
            <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
              <label className="text-sm mr-2">Exit Price</label>
              <Controller
                control={control}
                name="exitPrice"
                render={({ field }) => (
                  <CurrencyInput
                    // allowEmptyValue={true}
                    placeholder="0.00"
                    suffix="$"
                    decimalsLimit={2}
                    onBlur={() => handleFieldBlur("exitPrice")}
                    className="w-1/2 border-none bg-transparent focus:outline-none text-right"
                    onValueChange={(value) => field.onChange(value ? parseFloat(value) : 0)}
                    value={field.value === 0 ? "" : field.value}
                  />
                )}
              />
            </div>
          </div>

          {/* Expected Profit Percent */}
          <div className="mb-2">
            <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
              <label className="text-sm mr-2">Expected Profit %</label>
              <Controller
                control={control}
                name="expectedProfitPercent"
                render={({ field }) => (
                  <CurrencyInput
                    // allowEmptyValue={true}
                    placeholder="0.00"
                    suffix="%"
                    onBlur={() => handleFieldBlur("expectedProfitPercent")}
                    decimalsLimit={2}
                    className="w-1/2 border-none bg-transparent focus:outline-none text-right"
                    onValueChange={(value) => field.onChange(value ? parseFloat(value) : 0)}
                    value={field.value === 0 ? "" : field.value}
                  />
                )}
              />
            </div>
          </div>

          {/* Stop Loss */}
          <div className="mb-2">
            <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
              <label className="text-sm mr-2">Stop Loss</label>
              <Controller
                control={control}
                name="stopLoss"
                render={({ field }) => (
                  <CurrencyInput
                    // allowEmptyValue={true}
                    placeholder="0.00"
                    suffix="$"
                    onBlur={() => handleFieldBlur("stopLoss")}
                    decimalsLimit={2}
                    className="w-1/2 border-none bg-transparent focus:outline-none text-right"
                    onValueChange={(value) => field.onChange(value ? parseFloat(value) : 0)}
                    value={field.value === 0 ? "" : field.value}
                  />
                )}
              />
            </div>
          </div>

          {/* Expected Loss Percent */}
          <div className="mb-2">
            <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
              <label className="text-sm mr-2">Expected Loss %</label>
              <Controller
                control={control}
                name="expectedLossPercent"
                render={({ field }) => (
                  <CurrencyInput
                    // allowEmptyValue={true}
                    placeholder="0.00"
                    suffix="%"
                    decimalsLimit={2}
                    onBlur={() => handleFieldBlur("expectedLossPercent")}
                    className="w-1/2 border-none bg-transparent focus:outline-none text-right"
                    onValueChange={(value) => field.onChange(value ? parseFloat(value) : 0)}
                    value={field.value === 0 ? "" : field.value}
                  />
                )}
              />
            </div>
          </div>

          {/* Display Expected Profit & Loss */}
          <div className="flex justify-between mt-4 text-lg">
            <div className="text-green-500">Exp. profit: {watch("expectedProfit")}$</div>
            <div className="text-red-500">Exp. Loss: {watch("expectedLoss")}$</div>
          </div>
        </div>

        {creator && (
          <div className="mt-4 flex justify-center">
            <Button type="submit" className="bg-blue-600 w-full">
              Save Changes
            </Button>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <AddTickerBtn />
        </div>

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
