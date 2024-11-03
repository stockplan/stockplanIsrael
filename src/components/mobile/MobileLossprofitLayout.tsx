"use client";

import React, { useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import MobileMainTicker from "./MobileMainTicker";
import Totals from "@/app/home/calculator/_components/totals";
import { Position } from "@/types";
import MobileSubTickers from "./MobileSubTickers";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { useUnsavedChangesContext } from "@/hooks/useUnsavedChangesContext";
import { hasDataChanged } from "@/utils";
import axios from "axios";

interface MobileLayoutProps {
  creator: string;
  serverUserStocks: Position[];
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  creator,
  serverUserStocks,
}) => {
  const [tableData, setTableData] = useState<Position[]>(serverUserStocks);
  const [selectedTicker, setSelectedTicker] = useState<Position | null>(null);
  const [newTickerData, setNewTickerData] = useState<Position | null>(null);
  const originalDataRef = useRef<Position[]>(serverUserStocks);
  // const [isLoading, setIsLoading] = useState(false);

  const { unsavedChanges, setUnsavedChanges } = useUnsavedChangesContext();

  const { toast } = useToast();

  // not sure if the issue is here or in  saving function
  const updateTableData = (tickerData: Position) => {
    setTableData((prevData) => {
      const existingTickerIndex = prevData.findIndex(
        (item) => item._id === tickerData._id
      );
      // console.log(tableData);
      if (existingTickerIndex >= 0) {
        // Update existing ticker data
        const updatedData = [...prevData];
        updatedData[existingTickerIndex] = tickerData;
        return updatedData;
      } else {
        return prevData;
      }
    });
  };

  // current ticker displayed with all data
  const handleTickerSelect = (ticker: Position) => {
    setSelectedTicker(ticker);
  };

  const fetchActualPrice = async (ticker: string) => {
    try {
      const response = await fetch(
        `/api/tickerPrice?ticker=${ticker.toUpperCase()}`
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.fetchedPrice;
    } catch (error) {
      console.error(`Error fetching actual price for ${ticker}:`, error);
      return 0; // Fallback price or error handling
    }
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

    if (!newTickerData || !validateNewTicker(newTickerData)) return;

    setTableData([...tableData, newTickerData]);
    setNewTickerData(null);
  };

  // Need to Fix saveing, tabledata is clearly changing != original but still unsavechange is still false
  // Need to Fix saveing, tabledata is clearly changing != original but still unsavechange is still false
  // Need to Fix saveing, tabledata is clearly changing != original but still unsavechange is still false
  const saveChanges = async (changes: Position[]) => {
    if (hasDataChanged(changes, originalDataRef.current)) {
      setUnsavedChanges(false);
      return;
    }
    console.log(unsavedChanges);
    if (creator && unsavedChanges) {
      console.log("hi");
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

  return (
    <div className="p-4 bg-gray-800 text-white">
      <div className="flex justify-between mb-4 gap-3">
        <Button className="bg-gray-700">See all Tickers</Button>
        <div className="overflow-x-auto w-full max-w-full">
          <MobileSubTickers
            tableData={tableData}
            onTickerSelect={handleTickerSelect}
          />
        </div>
      </div>

      <div className="bg-gray-900 p-4 rounded-md">
        {/* <img src="/logo.png" alt="StocksPlan.com" className="mx-auto" /> */}
        <h2
          className="text-xl font-semibold mt-2"
          onClick={() => console.log(tableData)} //FOR REFRENCE
        >
          Quick Profit & Loss Calculator
        </h2>
        <MobileMainTicker
          updateTableData={updateTableData}
          selectedTicker={selectedTicker}
          fetchActualPrice={fetchActualPrice}
          onNewTickerDataChange={setNewTickerData}
        />
      </div>

      <div className="mt-4 flex justify-center">
        <Button
          className="bg-blue-600 w-full"
          onClick={() => saveChanges(tableData)}
        >
          Save Changes
        </Button>
      </div>

      <div className="mt-6 flex justify-center">
        <Button className="bg-gray-700 w-full" onClick={addNewTicker}>
          + Add Ticker
        </Button>
      </div>

      <Totals tableData={tableData} />
    </div>
  );
};

export default MobileLayout;
