import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Position } from "@/types";
import {
  calculateCost,
  calculateExitPriceFromProfitPercent,
  calculateExpectedLoss,
  calculateExpectedLossPercent,
  calculateExpectedProfit,
  calculateExpectedProfitPercent,
  calculateStopLossFromLossPercent,
} from "@/utils/calc-helpers";
import CurrencyInput from "react-currency-input-field";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { useUnsavedChangesContext } from "@/hooks/useUnsavedChangesContext";
import axios from "axios";
import { hasDataChanged } from "@/utils";
import useSWR from "swr";

interface MobileMainTickerProps {
  tableData: Position[];
  creator: string;
  editedticker: Position;
  emptyPosition: Position;
  setEditedTicker: React.Dispatch<React.SetStateAction<Position>>;
  selectedTicker: Position | null;
  setTableData: React.Dispatch<React.SetStateAction<Position[]>>;
  setSelectedTicker: React.Dispatch<React.SetStateAction<Position | null>>;
  fetchActualPrice: (ticker: string) => Promise<number>;
}

const fetcher = async (url: string, currTicker: string) =>
  await axios.get(`${url}?ticker=${currTicker}`).then((res) => {
    return res.data;
  });

const MobileMainTicker: React.FC<MobileMainTickerProps> = ({
  creator,
  tableData,
  editedticker,
  emptyPosition,
  setEditedTicker,
  selectedTicker,
  setTableData,
  setSelectedTicker,
  fetchActualPrice,
}) => {
  const [originalValues, setOriginalValues] = useState<Position>(emptyPosition);

  const { toast } = useToast();

  // starting position empty or fill input with selectedTicker
  useEffect(() => {
    setEditedTicker(selectedTicker || emptyPosition);
    setOriginalValues(selectedTicker || emptyPosition);
  }, [selectedTicker]);

  const handleInputChange = (field: keyof Position, value: any) => {
    setEditedTicker((prevticker) => ({ ...prevticker, [field]: value }));

    //maybe a beter way to do it. find the index of the editedticker and change it in tabledata
    if (editedticker) {
      setTableData((prevData) => {
        const existingTickerIndex = prevData.findIndex(
          (ticker) => ticker._id === ticker._id
        );
        // console.log(tableData);
        if (existingTickerIndex >= 0) {
          // Update existing ticker data
          const updatedData = [...prevData];
          updatedData[existingTickerIndex] = editedticker;
          return updatedData;
        } else {
          return prevData;
        }
      });
    }
  };
  //prettier-ignore
  const hasValueChanged = (originalValue: number, currentValue: number): boolean => {
    return originalValue !== currentValue;
  };

  //Positiontype
  //prettier-ignore
  const handlePositionTypeChange = (type: "buy" | "sell") => {
    const expProfit = calculateExpectedProfit(type, editedticker.askPrice, editedticker.exitPrice, editedticker.quantity);
    const expectedProfitPercent = calculateExpectedProfitPercent(expProfit, editedticker.cost);
    const expLoss = calculateExpectedLoss(type, editedticker.askPrice, editedticker.stopLoss, editedticker.quantity);
    const expLossPercent = calculateExpectedLossPercent(expLoss, editedticker.cost);
    
    setEditedTicker((prevticker) => ({
      ...prevticker,
      positionType: type,
      expectedProfit: +expProfit,
      expectedProfitPercent,
      expectedLoss: expLoss,
      expLossPercent,
    }));
    // updateTableData(editedticker)
  };

  //  use this function below for the handleTickerBlur, suppose to be better for the get calls
  const { data, error, isLoading, isValidating } = useSWR(
    editedticker.ticker ? ["/api/tickerPrice", editedticker.ticker] : null,
    ([url, currTicker]) => fetcher(url, currTicker),
    {
      fallbackData: editedticker.actualPrice,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  // Ticker & actual price
  const handleTickerBlur = async () => {
    if (editedticker.ticker) {
      const price = await fetchActualPrice(editedticker.ticker);
      setEditedTicker((prevticker) => ({
        ...prevticker,
        actualPrice: price || 0,
        // actualPrice: +data.fetchedPrice || 0,
      }));
    }
  };

  //prettier-ignore
  const handleBlur = async (name: string, value: any) => {
    // Precompute common calculations
    const updatedCost = calculateCost(editedticker.askPrice, editedticker.quantity);
    const expectedProfit = calculateExpectedProfit(editedticker.positionType, editedticker.askPrice, editedticker.exitPrice, editedticker.quantity)
    const expectedProfitPercent = calculateExpectedProfitPercent(expectedProfit, updatedCost);
    const expectedLoss = calculateExpectedLoss(editedticker.positionType, editedticker.askPrice, editedticker.stopLoss, editedticker.quantity);
    const expectedLossPercent = calculateExpectedLossPercent(expectedLoss, updatedCost);
    const newExitPrice = calculateExitPriceFromProfitPercent(editedticker.positionType, editedticker.askPrice, expectedProfit, editedticker.quantity);
  
    const absLossPercent = Math.abs(editedticker.expectedLossPercent);
    // Expected Loss = (-1) * (Expected Loss % * total cost / 100)
    const newExpectedLoss = ((absLossPercent * updatedCost) / 100) * -1 + 0;
    // Stop Loss = newExpectedLoss(Expected Loss / Quantity) + Ask Price
    const newStopLoss = calculateStopLossFromLossPercent(newExpectedLoss, editedticker.quantity, editedticker.askPrice);

    // ONLY in EXP.Loss% need to understand those functions, maybe it have to be negative num
    // const negativeValue =
    //   +lossPercent > 0 ? +lossPercent * -1 : +lossPercent;
    // const formattedVal = formatFractionDigits(+initialValue);

    // if (+formattedVal > 0 && negativeValue === 0) return;
    //? all above to ask daniel
  
    switch (name) {
      case "ticker":
        if (selectedTicker?.ticker) {
          toast({
            title: "Overriding existing ticker",
            description: "Please clear to add new ticker",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
          return;
        }
        if (value && data) {
          // const price = await fetchActualPrice(value);
          setEditedTicker((prev) => ({
            ...prev,
            ctualPrice: +data.fetchedPrice || 0,
            // actualPrice: price || 0,
          }));
        }
        break;
  
      case "quantity":
        if (!hasValueChanged(originalValues.quantity, editedticker.quantity)) return;
        setEditedTicker((prev) => ({
          ...prev,
          cost: updatedCost,
          expectedProfit,
          expectedProfitPercent,
          expectedLoss,
          expectedLossPercent,
        }));
        break;
  
      case "askPrice":
        if (!hasValueChanged(originalValues.askPrice, editedticker.askPrice)) return;
        setEditedTicker((prev) => ({
          ...prev,
          cost: updatedCost,
          expectedProfit,
          expectedProfitPercent,
          expectedLoss,
          expectedLossPercent,
        }));
        break;
  
      case "exitPrice":
        if (value === 0 || isNaN(value)) return;
        if (!hasValueChanged(originalValues.exitPrice, value)) return;
        setEditedTicker((prev) => ({
          ...prev,
          expectedProfit,
          expectedProfitPercent,
        }));
        break;
  
      case "profitPercent":
        if (value <= 0) {
          setEditedTicker((prev) => ({ ...prev, expectedProfitPercent: 0 }));
          return;
        }
        if (!hasValueChanged(originalValues.expectedProfitPercent, value)) return;
        setEditedTicker((prev) => ({
          ...prev,
          expectedProfit,
          exitPrice: newExitPrice,
        }));
        break;
  
      case "stopLoss":
        if (!hasValueChanged(originalValues.stopLoss, value)) return;
        setEditedTicker((prev) => ({
          ...prev,
          expectedLoss,
          expectedLossPercent,
        }));
        break;
  
      case "lossPercent":
        if (!hasValueChanged(originalValues.expectedLossPercent, value)) return;
        setEditedTicker((prev) => ({
          ...prev,
          expectedLoss: newExpectedLoss,
          stopLoss: newStopLoss,
        }));
        break;
  
      default:
        console.warn("Unhandled field in handleBlur");
    }
  };

  // this component sholdnt hold the hole data only the selected ticker. not sure about it
  return (
    <div>
      <div className="mb-4 p-4 border border-gray-700 rounded-lg">
        {/* Ticker and Cost Display */}
        <div className="mb-2">
          <div className="border border-gray-600 p-2 rounded-md flex justify-between items-center">
            <Input
              value={editedticker.ticker}
              onChange={(e) =>
                handleInputChange("ticker", e.target.value.toUpperCase())
              }
              name="ticker"
              // onBlur={(e) => handleBlur(e.target.name, e.target.value)}
              onBlur={handleTickerBlur}
              className="w-1/2 border-none bg-transparent focus:outline-none text-white"
            />
            <CurrencyInput
              value={editedticker.actualPrice}
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
              editedticker.positionType === "buy"
                ? "bg-green-500"
                : "bg-gray-400"
            }`}
            onClick={() => handlePositionTypeChange("buy")}
          >
            Buy
          </button>
          <button
            className={`px-2 py-1 w-1/2 rounded text-white ${
              editedticker.positionType === "sell"
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
              value={editedticker.quantity}
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
              value={editedticker.askPrice}
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
              value={editedticker.cost}
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
              value={editedticker.exitPrice}
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
              value={editedticker.expectedProfitPercent}
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
              value={editedticker.stopLoss}
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
              value={editedticker.expectedLossPercent}
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
            {/* Exp. profit: {editedticker.expectedProfit >= 0 ? editedticker.expectedProfit : 0}$ */}
            Exp. profit: {editedticker.expectedProfit}$
          </div>
          <div className="text-red-500">
            {/* Exp. Loss: {editedticker.expectedLoss <= 0 ? editedticker.expectedLoss : 0}$ */}
            Exp. Loss: {editedticker.expectedLoss}$
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMainTicker;
