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

interface MobileMainTickerProps {
  tableData: Position[];
  creator: string;
  selectedTicker: Position | null;
  setTableData: React.Dispatch<React.SetStateAction<Position[]>>;
  // updateTableData: (tickerData: Position) => void;
  fetchActualPrice: (ticker: string) => Promise<number>;
  // onNewTickerDataChange: (data: Position) => void;
}

const emptyPosition: Position = {
  ticker: "",
  actualPrice: 0,
  cost: 0,
  askPrice: 0,
  quantity: 0,
  exitPrice: 0,
  stopLoss: 0,
  positionType: "buy",
  expectedProfit: 0,
  expectedProfitPercent: 0,
  expectedLoss: 0,
  expectedLossPercent: 0,
};

const MobileMainTicker: React.FC<MobileMainTickerProps> = ({
  creator,
  tableData,
  selectedTicker,
  setTableData,
  // updateTableData,
  fetchActualPrice,
  // onNewTickerDataChange,
}) => {
  const [item, setItem] = useState<Position>(emptyPosition);
  const [originalValues, setOriginalValues] = useState<Position>(emptyPosition);
  const originalDataRef = useRef<Position[]>(tableData);

  const { unsavedChanges, setUnsavedChanges } = useUnsavedChangesContext();
  const { toast } = useToast();

  useEffect(() => {
    setItem(selectedTicker || emptyPosition);
    setOriginalValues(selectedTicker || emptyPosition);
  }, [selectedTicker]);

  useEffect(() => {
    setUnsavedChanges(true);
  }, [tableData]);

  const handleInputChange = (field: keyof Position, value: any) => {
    setItem((prevItem) => ({ ...prevItem, [field]: value }));

    //maybe a beter way to do it. find the index of the item and change it in tabledata
    if (item) {
      setTableData((prevData) => {
        const existingTickerIndex = prevData.findIndex(
          (ticker) => ticker._id === item._id
        );
        // console.log(tableData);
        if (existingTickerIndex >= 0) {
          // Update existing ticker data
          const updatedData = [...prevData];
          updatedData[existingTickerIndex] = item;
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

  // Ticker & actual price
  const handleTickerBlur = async () => {
    if (selectedTicker?.ticker) {
      const validationToast = {
        title: "Overriding existing ticker",
        description: "Please clear to add new ticker",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      };
      toast(validationToast);
      return;
    }
    if (item.ticker) {
      const price = await fetchActualPrice(item.ticker);
      setItem((prevItem) => ({
        ...prevItem,
        actualPrice: price || 0,
      }));
    }
  };

  //Positiontype
  //prettier-ignore
  const handlePositionTypeChange = (type: "buy" | "sell") => {
    const expProfit = calculateExpectedProfit(type, item.askPrice, item.exitPrice, item.quantity);
    const expectedProfitPercent = calculateExpectedProfitPercent(expProfit, item.cost);
    const expLoss = calculateExpectedLoss(type, item.askPrice, item.stopLoss, item.quantity);
    const expLossPercent = calculateExpectedLossPercent(expLoss, item.cost);

    setItem((prevItem) => ({
      ...prevItem,
      positionType: type,
      expectedProfit: +expProfit,
      expectedProfitPercent,
      expectedLoss: expLoss,
      expLossPercent,
    }));
    // updateTableData(item)
  };

  // Quantity
  //prettier-ignore
  const handleBlurQuantity = () => {
    if (!hasValueChanged(originalValues.quantity, item.quantity)) {
      return; 
    }
    const updatedCost = calculateCost(item.askPrice, item.quantity)
    const expectedProfit = calculateExpectedProfit( item.positionType, item.askPrice, item.exitPrice, item.quantity)
    const expectedProfitPercent = calculateExpectedProfitPercent(expectedProfit, updatedCost)
    const expectedLoss = calculateExpectedLoss(item.positionType, item.askPrice, item.stopLoss, item.quantity)
    const expectedLossPercent = calculateExpectedLossPercent(expectedLoss, updatedCost)
    
    setItem((prevItem) => ({
      ...prevItem,
      cost: updatedCost,
      expectedProfit,
      expectedProfitPercent,
      expectedLoss,
      expectedLossPercent,
    }));
    setOriginalValues((prev) => ({
      ...prev,
      expectedProfitPercent: item.quantity
    }));
    // updateTableData(item)
  }

  // AskPrice
  //prettier-ignore
  const handleBlurAskPrice = () => {
    if (!hasValueChanged(originalValues.askPrice, item.askPrice)) {
      return; 
    }
    // if (+askPrice === +defaultValue) return
    const updatedCost = calculateCost(item.askPrice, item.quantity)
    const expectedProfit = calculateExpectedProfit( item.positionType, item.askPrice, item.exitPrice, item.quantity)
    const expectedProfitPercent = calculateExpectedProfitPercent(expectedProfit, updatedCost)
    const expectedLoss = calculateExpectedLoss(item.positionType, item.askPrice, item.stopLoss, item.quantity)
    const expectedLossPercent = calculateExpectedLossPercent(expectedLoss, updatedCost)

    setItem((prevItem) => ({
      ...prevItem,
      cost: updatedCost,
      expectedProfit,
      expectedProfitPercent,
      expectedLoss,
      expectedLossPercent,
    }));
    setOriginalValues((prev) => ({
      ...prev,
      expectedProfitPercent: item.askPrice
    }));
    // updateTableData(item)
  }

  // ExitPrice
  //prettier-ignore
  const handleBlurExitPrice = () => {
    if (item.exitPrice === 0 || isNaN(item.exitPrice)) return;
    if (!hasValueChanged(originalValues.exitPrice, item.exitPrice)) {
      return; 
    }

    // const cost = calculateCost(item.askPrice, item.quantity)
    const expectedProfit = calculateExpectedProfit(item.positionType, item.askPrice, item.exitPrice, item.quantity)
    const expectedProfitPercent = calculateExpectedProfitPercent(expectedProfit, item.cost)
    
    setItem((prevItem) => ({
      ...prevItem,
      expectedProfit,
      expectedProfitPercent,
    }));
    setOriginalValues((prev) => ({
      ...prev,
      expectedProfitPercent: item.exitPrice
    }));
    // updateTableData(item)
  }

  // EXP.Profit%
  //prettier-ignore
  const handleBlurProfitPercent = () => {
    // console.log(item.expectedProfitPercent)
    if (item.expectedProfitPercent <= 0) {
      setItem((prevItem) => ({ ...prevItem, expectedProfitPercent: 0 }));
      return;
    }
    if (!hasValueChanged(originalValues.expectedProfitPercent, item.expectedProfitPercent)) {
      return; 
    }
    console.log(item.expectedProfitPercent)

    const newExpectedProfit = (item.expectedProfitPercent * item.cost) / 100;
    const newExitPrice = calculateExitPriceFromProfitPercent(item.positionType, item.askPrice, newExpectedProfit, item.quantity)
    setItem((prevItem) => ({
      ...prevItem,
      expectedProfit: newExpectedProfit,
      exitPrice: newExitPrice,
    }));
    setOriginalValues((prev) => ({
      ...prev,
      expectedProfitPercent: item.expectedProfitPercent
    }));
    // updateTableData(item)
  }

  // Stop loss
  //prettier-ignore
  const handleBlurStopLoss = () => {
    if (!hasValueChanged(originalValues.stopLoss, item.stopLoss)) {
      return; 
    }

    let expectedLoss = calculateExpectedLoss(item.positionType, item.askPrice, item.stopLoss, item.quantity);
    const expectedLossPercent = calculateExpectedLossPercent(expectedLoss, item.cost);

    setItem((prevItem) => ({
      ...prevItem,
      expectedLoss: +expectedLoss,
      expectedLossPercent: +expectedLossPercent,
    }));
    setOriginalValues((prev) => ({
      ...prev,
      expectedProfitPercent: item.stopLoss
    }));
    // updateTableData(item)
  };

  // EXP.Loss%
  //prettier-ignore
  const handleBlurlossPercent = () => {
    // const negativeValue =
    //   +lossPercent > 0 ? +lossPercent * -1 : +lossPercent;
    // const formattedVal = formatFractionDigits(+initialValue);

    // if (+formattedVal > 0 && negativeValue === 0) return;
    //? all above to ask daniel

    if (!hasValueChanged(originalValues.expectedLossPercent, item.expectedLossPercent)) {
      return; 
    }

    const absValue = Math.abs(+item.expectedLossPercent);
    // Expected Loss = (-1) * (Expected Loss % * total cost / 100)
    const newExpectedLoss = ((absValue * item.cost) / 100) * -1 + 0;

    // Stop Loss = newExpectedLoss(Expected Loss / Quantity) + Ask Price
    let newStopLoss = calculateStopLossFromLossPercent(newExpectedLoss, item.quantity, item.askPrice);

    setItem((prevItem) => ({
      ...prevItem,
      expectedLoss: +newExpectedLoss,
      stopLoss: newStopLoss,
    }));
    setOriginalValues((prev) => ({
      ...prev,
      expectedProfitPercent: item.expectedLossPercent
    }));
    // updateTableData(item)
  };

  const validateNewTicker = (lastTicker: Position) => {
    const validationToast = {
      title: "",
      description: "",
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    };

    // Validate ticker
    if (!lastTicker.ticker) {
      validationToast.title = "Missing Ticker Symbol";
      validationToast.description = "Please enter a ticker symbol.";
    }

    // Validate askPrice
    else if (lastTicker.askPrice === 0) {
      validationToast.title = "Ask Price Required";
      validationToast.description = "Please enter an ask price greater than 0.";
    }

    // Validate quantity
    else if (lastTicker.quantity === 0) {
      validationToast.title = "Quantity Needed";
      validationToast.description = "Please enter a quantity greater than 0.";
    }
    // prevents duplicate ticker before a change
    else if (lastTicker._id === selectedTicker?._id) {
      validationToast.title = "Ticker already exist";
      validationToast.description = "Please change an input or clear all";
    }

    if (validationToast.description) {
      toast(validationToast);
      return false;
    }
    return true;
  };

  const addNewTicker = () => {
    const maxTickers = 10;
    if (!creator || tableData.length >= maxTickers) {
      if (tableData.length >= maxTickers) {
        toast({
          description: `Maximum of ${maxTickers} rows allowed.`,
          variant: "destructive",
        });
      }
      return;
    }

    const lastTicker = tableData[tableData.length - 1];
    if (!validateNewTicker(lastTicker)) return; //something las page, ask daniel // table.lastPage();

    if (!item || !validateNewTicker(item)) return;

    setTableData([...tableData, item]);
    setUnsavedChanges(true);
  };

  const saveChanges = async (changes: Position[]) => {
    if (hasDataChanged(changes, originalDataRef.current)) {
      setUnsavedChanges(false);
      return;
    }

    if (creator && unsavedChanges) {
      // console.log("hi");
      // setIsLoading(true);
      try {
        await axios.post("/api/save", { changes });
        originalDataRef.current = changes;
        setUnsavedChanges(false);
        localStorage.removeItem("unsavedChanges");
      } catch (error) {
        console.error("Failed to save data", error);

        // Save changes locally in case of API failure
        try {
          localStorage.setItem("unsavedChanges", JSON.stringify(changes));
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } catch (localError) {
          console.error("Failed to save changes locally", localError);
        }
      } finally {
        // setIsLoading(false);
      }
    }
  };

  const deleteTicker = (tickerToDelete: Position | null) => {
    if (tickerToDelete && tickerToDelete._id) {
      setTableData((prevData) =>
        prevData.filter((item) => item._id !== tickerToDelete._id)
      );
    }
    setUnsavedChanges(true);
  };

  return (
    <div>
      <div className="mb-4 p-4 border border-gray-700 rounded-lg">
        {/* Ticker and Cost Display */}
        <div className="mb-2">
          <div className="border border-gray-600 p-2 rounded-md flex justify-between items-center">
            <Input
              value={item.ticker}
              onChange={(e) => handleInputChange("ticker", e.target.value)}
              onBlur={handleTickerBlur}
              className="w-1/2 border-none bg-transparent focus:outline-none text-white"
            />
            <CurrencyInput
              value={item.actualPrice}
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
              item.positionType === "buy" ? "bg-green-500" : "bg-gray-400"
            }`}
            onClick={() => handlePositionTypeChange("buy")}
          >
            Buy
          </button>
          <button
            className={`px-2 py-1 w-1/2 rounded text-white ${
              item.positionType === "sell" ? "bg-red-500" : "bg-gray-400"
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
              value={item.quantity}
              onValueChange={(value) =>
                handleInputChange("quantity", parseInt(value || "0"))
              }
              onBlur={handleBlurQuantity}
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
              value={item.askPrice}
              onValueChange={(value) =>
                handleInputChange("askPrice", parseFloat(value || "0"))
              }
              onBlur={handleBlurAskPrice}
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
              value={item.cost}
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
              value={item.exitPrice}
              onValueChange={(value) =>
                handleInputChange("exitPrice", parseFloat(value || "0"))
              }
              onBlur={handleBlurExitPrice}
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
              value={item.expectedProfitPercent}
              onValueChange={(value) =>
                handleInputChange(
                  "expectedProfitPercent",
                  parseFloat(value || "0")
                )
              }
              onBlur={handleBlurProfitPercent}
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
              value={item.stopLoss}
              onValueChange={(value) =>
                handleInputChange("stopLoss", parseFloat(value || "0"))
              }
              onBlur={handleBlurStopLoss}
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
              value={item.expectedLossPercent}
              onValueChange={(value) =>
                handleInputChange(
                  "expectedLossPercent",
                  parseFloat(value || "0")
                )
              }
              onBlur={handleBlurlossPercent}
              className="w-1/2 border-none bg-transparent focus:outline-none text-right"
              suffix="%"
              decimalsLimit={2}
            />
          </div>
        </div>

        {/* Expected Profit and Loss Summary */}
        <div className="flex justify-between mt-4 text-lg">
          <div className="text-green-500">
            {/* Exp. profit: {item.expectedProfit >= 0 ? item.expectedProfit : 0}$ */}
            Exp. profit: {item.expectedProfit}$
          </div>
          <div className="text-red-500">
            {/* Exp. Loss: {item.expectedLoss <= 0 ? item.expectedLoss : 0}$ */}
            Exp. Loss: {item.expectedLoss}$
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <Button
          className="bg-blue-600 w-full"
          onClick={() => saveChanges(tableData)}
        >
          Save Changes
        </Button>
      </div>

      <button onClick={() => deleteTicker(selectedTicker)}>Delete</button>

      <div className="mt-6 flex justify-center">
        <Button className="bg-gray-700 w-full" onClick={addNewTicker}>
          + Add Ticker
        </Button>
      </div>
    </div>
  );
};

export default MobileMainTicker;
