import React, { useEffect, useState } from "react"
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
import { useToast } from "../ui/use-toast"
import { ToastAction } from "../ui/toast"
import axios from "axios"
import useSWR from "swr"
import { useLossProfitState } from "./useLossprofitState"
import { getEmptyRow } from "@/lib/utils"

interface MobileMainTickerProps {}

const fetcher = async (url: string, currTicker: string) =>
  await axios.get(`${url}?ticker=${currTicker}`).then((res) => {
    return res.data
  })

const MobileMainTicker: React.FC<MobileMainTickerProps> = ({}) => {
  const { selectedTicker } = useLossProfitState()

  const [originalValues, setOriginalValues] = useState<Position>(
    selectedTicker || getEmptyRow()
  )

  const { toast } = useToast()

  // starting position empty or fill input with selectedTicker
  useEffect(() => {
    if (selectedTicker) {
      setOriginalValues(selectedTicker!)
    }
  }, [])

  const handleInputChange = (field: keyof Position, value: any) => {
    setOriginalValues((prevTicker) => ({ ...prevTicker, [field]: value }))

    // const originalValue = originalValues[field] as string | number
    // Update only if the value has changed
    // if (hasValueChanged(originalValue, value)) {
    //   setTickersData((prevData) => {
    //     // find the index of the changed ticker in the array
    //     const existingTickerIndex = prevData.findIndex(
    //       (ticker) => ticker._id === originalValues._id
    //     )
    //     if (existingTickerIndex >= 0) {
    //       // Update existing ticker data live before save
    //       const updatedData = [...prevData]
    //       updatedData[existingTickerIndex] = {
    //         ...updatedData[existingTickerIndex],
    //         [field]: value,
    //       }
    //       return updatedData
    //     } else {
    //       return prevData
    //     }
    //   })
    // }
  }

  //prettier-ignore
  const hasValueChanged = (originalValue: string | number, currentValue: string | number): boolean => {
    return originalValue !== currentValue;
  };

  //PositionType
  //prettier-ignore
  const handlePositionTypeChange = (type: "buy" | "sell") => {
    const expProfit = calculateExpectedProfit(type, originalValues.askPrice, originalValues.exitPrice, originalValues.quantity);
    const expectedProfitPercent = calculateExpectedProfitPercent(expProfit, originalValues.cost);
    const expLoss = calculateExpectedLoss(type, originalValues.askPrice, originalValues.stopLoss, originalValues.quantity);
    const expLossPercent = calculateExpectedLossPercent(expLoss, originalValues.cost);
    
    setOriginalValues((prevTicker) => ({
      ...prevTicker,
      positionType: type,
      expectedProfit: +expProfit,
      expectedProfitPercent,
      expectedLoss: expLoss,
      expLossPercent,
    }));
  };

  //  used for the fetched price to reduce calling GET
  const { data, error, isLoading, isValidating } = useSWR(
    originalValues.ticker ? ["/api/tickerPrice", originalValues.ticker] : null,
    ([url, currTicker]) => fetcher(url, currTicker),
    {
      fallbackData: originalValues.actualPrice,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      refreshInterval: 2 * 60 * 1000,
    }
  )

  //prettier-ignore
  const handleBlur = async (name: string, value: any) => {
    // turn value to number instead of string
    const numericValue = parseFloat(value.toString().replace(/[^\d.-]/g, ""));
    // Precompute common calculations
    const updatedCost = calculateCost(originalValues.askPrice, originalValues.quantity);
    const expectedProfit = calculateExpectedProfit(originalValues.positionType, originalValues.askPrice, originalValues.exitPrice, originalValues.quantity)
    const expectedProfitPercent = calculateExpectedProfitPercent(expectedProfit, updatedCost);
    const expectedLoss = calculateExpectedLoss(originalValues.positionType, originalValues.askPrice, originalValues.stopLoss, originalValues.quantity);
    const expectedLossPercent = calculateExpectedLossPercent(expectedLoss, updatedCost);
    let tmpExpectedProfitForExitPriceFromEXPPresent = numericValue * updatedCost / 100
    const newExitPrice = calculateExitPriceFromProfitPercent(originalValues.positionType, originalValues.askPrice, tmpExpectedProfitForExitPriceFromEXPPresent, originalValues.quantity);
  
    const absLossPercent = Math.abs(originalValues.expectedLossPercent);
    // Expected Loss = (-1) * (Expected Loss % * total cost / 100)
    const newExpectedLoss = ((absLossPercent * updatedCost) / 100) * -1 + 0;
    // Stop Loss = newExpectedLoss(Expected Loss / Quantity) + Ask Price
    const newStopLoss = calculateStopLossFromLossPercent(newExpectedLoss, originalValues.quantity, originalValues.askPrice);

    // ONLY in EXP.Loss% need to understand those functions, maybe it have to be negative num
    // const negativeValue =
    //   +lossPercent > 0 ? +lossPercent * -1 : +lossPercent;
    // const formattedVal = formatFractionDigits(+initialValue);

    // if (+formattedVal > 0 && negativeValue === 0) return;
    //? all above to ask daniel
  
    // issues with EXP.profit%  because calculateExitPriceFromProfitPercent  
    // exitPrice, EXP.Loss% & stopLoss  doesn't work when goes back to 0   
    // 

    switch (name) {
      case "ticker":
        if (selectedTicker?.ticker) {
          //todo: ask tomer
          // toast({
          //   title: "Overriding existing ticker",
          //   description: "Please clear to add new ticker",
          //   action: <ToastAction altText="Try again">Try again</ToastAction>,
          // });
          // return;
        }
        if (value && data) {
          setOriginalValues((prev) => ({
            ...prev,
            actualPrice: +data.fetchedPrice || 0,
          }));
        }
        break;
  
      case "quantity":
        if (!hasValueChanged(originalValues.quantity, originalValues.quantity)) return;
        setOriginalValues((prev) => ({
          ...prev,
          cost: updatedCost,
          expectedProfit,
          expectedProfitPercent,
          expectedLoss,
          expectedLossPercent,
        }));
        break;
  
      case "askPrice":
        if (!hasValueChanged(originalValues.askPrice, originalValues.askPrice)) return;
        setOriginalValues((prev) => ({
          ...prev,
          cost: updatedCost,
          expectedProfit,
          expectedProfitPercent,
          expectedLoss,
          expectedLossPercent,
        }));
        break;
  
      case "exitPrice":
        if (numericValue === 0 || isNaN(numericValue)) return;
        if (!hasValueChanged(originalValues.exitPrice, numericValue)) return;
        setOriginalValues((prev) => ({
          ...prev,
          expectedProfit,
          expectedProfitPercent,
        }));
        break;
  
      case "profitPercent":
        if (numericValue <= 0) {
          setOriginalValues((prev) => ({ ...prev, expectedProfitPercent: 0 }));
          return;
        }
        if (!hasValueChanged(originalValues.expectedProfitPercent, numericValue)) return;
        setOriginalValues((prev) => ({
          ...prev,
          expectedProfit,
          exitPrice: newExitPrice,
        }));
        break;
  
      case "stopLoss":
        if (!hasValueChanged(originalValues.stopLoss, numericValue)) return;
        setOriginalValues((prev) => ({
          ...prev,
          expectedLoss,
          expectedLossPercent,
        }));
        break;
  
      case "lossPercent":
        if (!hasValueChanged(originalValues.expectedLossPercent, numericValue)) return;
        setOriginalValues((prev) => ({
          ...prev,
          expectedLoss: newExpectedLoss,
          stopLoss: newStopLoss,
        }));
        break;
  
      default:
        console.warn("Unhandled field in handleBlur");
    }
  };

  return (
    <div>
      <div className="mb-4 p-4 border border-gray-700 rounded-lg">
        {/* Ticker and Cost Display */}
        <div className="mb-2">
          <div className="border border-gray-600 p-2 rounded-md flex justify-between items-center">
            <Input
              value={originalValues.ticker}
              onChange={(e) =>
                handleInputChange("ticker", e.target.value.toUpperCase())
              }
              name="ticker"
              onBlur={(e) => handleBlur(e.target.name, e.target.value)}
              className="w-1/2 border-none bg-transparent focus:outline-none text-white"
            />
            <CurrencyInput
              value={originalValues.actualPrice}
              name="actualPrice"
              readOnly
              className="w-1/2 text-right border-none bg-transparent focus:outline-none text-white"
              suffix="$"
              decimalsLimit={2}
            />
          </div>
        </div>

        {/* Buy and Sell Buttons */}
        <div className="flex justify-between mb-4">
          <button
            className={`px-2 py-1 w-1/2 rounded text-white ${
              originalValues.positionType === "buy"
                ? "bg-green-500"
                : "bg-gray-400"
            }`}
            onClick={() => handlePositionTypeChange("buy")}
          >
            Buy
          </button>
          <button
            className={`px-2 py-1 w-1/2 rounded text-white ${
              originalValues.positionType === "sell"
                ? "bg-red-500"
                : "bg-gray-400"
            }`}
            onClick={() => handlePositionTypeChange("sell")}
          >
            Sell
          </button>
        </div>

        {/* Quantity Input */}
        <div className="mb-2">
          <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
            <label className="text-sm mr-2">Quantity</label>
            <CurrencyInput
              value={originalValues.quantity}
              onValueChange={(value) =>
                handleInputChange("quantity", parseInt(value || "0"))
              }
              name="quantity"
              onBlur={(e) => handleBlur(e.target.name, e.target.value)}
              className="w-1/2 border-none bg-transparent focus:outline-none text-right"
              decimalsLimit={0}
            />
          </div>
        </div>

        {/* Ask Price Input */}
        <div className="mb-2">
          <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
            <label className="text-sm mr-2">Ask Price</label>
            <CurrencyInput
              value={originalValues.askPrice}
              onValueChange={(value) =>
                handleInputChange("askPrice", parseFloat(value || "0"))
              }
              name="askPrice"
              onBlur={(e) => handleBlur(e.target.name, e.target.value)}
              className="w-1/2 border-none bg-transparent focus:outline-none text-right"
              suffix="$"
              decimalsLimit={2}
            />
          </div>
        </div>

        {/* Cost Field */}
        <div className="mb-2">
          <div className="p-2 rounded-md flex items-center justify-between">
            <label className="text-sm mr-2">Cost</label>
            <CurrencyInput
              readOnly
              value={originalValues.cost}
              onValueChange={(value) =>
                handleInputChange("cost", parseFloat(value || "0"))
              }
              className="w-1/2 border-none bg-transparent focus:outline-none text-white text-right"
              suffix="$"
              decimalsLimit={2}
            />
          </div>
        </div>

        {/* Exit Price Input */}
        <div className="mb-2">
          <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
            <label className="text-sm mr-2">Exit Price</label>
            <CurrencyInput
              value={originalValues.exitPrice}
              onValueChange={(value) =>
                handleInputChange("exitPrice", parseFloat(value || "0"))
              }
              name="exitPrice"
              onBlur={(e) => handleBlur(e.target.name, e.target.value)}
              className="w-1/2 border-none bg-transparent focus:outline-none text-right"
              suffix="$"
              decimalsLimit={2}
            />
          </div>
        </div>

        {/* Expected Profit Percentage */}
        <div className="mb-2">
          <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
            <label className="text-sm mr-2">Expected Profit %</label>
            <CurrencyInput
              value={originalValues.expectedProfitPercent}
              onValueChange={(value) =>
                handleInputChange(
                  "expectedProfitPercent",
                  parseFloat(value || "0")
                )
              }
              name="profitPercent"
              onBlur={(e) => handleBlur(e.target.name, e.target.value)}
              className="w-1/2 border-none bg-transparent focus:outline-none text-right"
              suffix="%"
              decimalsLimit={2}
            />
          </div>
        </div>

        {/* Stop Loss Input */}
        <div className="mb-2">
          <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
            <label className="text-sm mr-2">Stop Loss</label>
            <CurrencyInput
              value={originalValues.stopLoss}
              onValueChange={(value) =>
                handleInputChange("stopLoss", parseFloat(value || "0"))
              }
              name="stopLoss"
              onBlur={(e) => handleBlur(e.target.name, e.target.value)}
              className="w-1/2 border-none bg-transparent focus:outline-none text-right"
              suffix="$"
              decimalsLimit={2}
            />
          </div>
        </div>

        {/* Expected Loss Percentage */}
        <div className="mb-2">
          <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
            <label className="text-sm mr-2">Expected Loss %</label>
            <CurrencyInput
              value={originalValues.expectedLossPercent}
              onValueChange={(value) =>
                handleInputChange(
                  "expectedLossPercent",
                  parseFloat(value || "0")
                )
              }
              name="lossPercent"
              onBlur={(e) => handleBlur(e.target.name, e.target.value)}
              className="w-1/2 border-none bg-transparent focus:outline-none text-right"
              suffix="%"
              decimalsLimit={2}
            />
          </div>
        </div>

        {/* Expected Profit and Loss Summary */}
        <div className="flex justify-between mt-4 text-lg">
          <div className="text-green-500">
            {/* Exp. profit: {originalValues.expectedProfit >= 0 ? originalValues.expectedProfit : 0}$ */}
            Exp. profit: {originalValues.expectedProfit}$
          </div>
          <div className="text-red-500">
            {/* Exp. Loss: {originalValues.expectedLoss <= 0 ? originalValues.expectedLoss : 0}$ */}
            Exp. Loss: {originalValues.expectedLoss}$
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileMainTicker
