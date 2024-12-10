"use client";

import React, { useEffect, useRef, useState } from "react";
import { Position } from "@/types";
import MobileAllTickers from "./MobileAllTickers";
import MobileEditorPage from "./MobileEditorPage";
import { ToastAction } from "../ui/toast";
import { useToast } from "../ui/use-toast";
import { useUnsavedChangesContext } from "@/hooks/useUnsavedChangesContext";
import { hasDataChanged } from "@/utils";
import axios from "axios";
import { getEmptyRow } from "@/lib/utils";

interface MobileLayoutProps {
  creator: string;
  serverUserStocks: Position[];
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  creator,
  serverUserStocks,
}) => {
  const emptyPosition = getEmptyRow(creator);
  const [editedticker, setEditedTicker] = useState<Position>(emptyPosition);
  const [tickersData, setTickersData] = useState<Position[]>(serverUserStocks);
  const [selectedTicker, setSelectedTicker] = useState<Position | null>(null);
  const [showAllTickers, setshowAllTickers] = useState<boolean>(true);
  const originalDataRef = useRef<Position[]>(tickersData);

  const { unsavedChanges, setUnsavedChanges } = useUnsavedChangesContext();

  const { toast } = useToast();

  // give the option to save when data changed/ might not be needed
  useEffect(() => {
    if (hasDataChanged(tickersData, originalDataRef.current)) {
      setUnsavedChanges(false);
    }
  }, [tickersData]);

  // current ticker displayed with all data in main ticker
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

    if (lastTicker) {
      // Validate ticker
      if (!lastTicker.ticker) {
        validationToast.title = "Missing Ticker Symbol";
        validationToast.description = "Please enter a ticker symbol.";
      }

      // Validate askPrice
      else if (lastTicker.askPrice === 0) {
        validationToast.title = "Ask Price Required";
        validationToast.description =
          "Please enter an ask price greater than 0.";
      }

      // Validate quantity
      else if (lastTicker.quantity === 0) {
        validationToast.title = "Quantity Needed";
        validationToast.description = "Please enter a quantity greater than 0.";
      }
    }

    if (validationToast.description) {
      toast(validationToast);
      return false;
    }
    return true;
  };

  // add empty new ticker
  const addNewTicker = () => {
    const maxTickers = 10;
    if (!creator || tickersData.length >= maxTickers) {
      if (tickersData.length >= maxTickers) {
        toast({
          description: `Maximum of ${maxTickers} rows allowed.`,
          variant: "destructive",
        });
      }
      return;
    }

    const lastTicker = tickersData[tickersData.length - 1];
    if (!validateNewTicker(lastTicker)) return; //something last page, ask daniel // table.lastPage();

    // Add a new empty ticker
    const newTicker = getEmptyRow(creator, "");
    setSelectedTicker(null);
    setEditedTicker(newTicker);
    setTickersData([...tickersData, newTicker]);
    setUnsavedChanges(true);
  };

  const saveChanges = async (changes: Position[]) => {
    if (hasDataChanged(changes, originalDataRef.current)) {
      setUnsavedChanges(false);
      return;
    }

    if (creator && unsavedChanges) {
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
        setEditedTicker(emptyPosition);
      }
    }
  };

  const deleteTicker = (tickerToDelete: Position | null) => {
    if (tickerToDelete && tickerToDelete.ticker) {
      setTickersData((prevData) =>
        prevData.filter((ticker) => ticker._id !== tickerToDelete._id)
      );
    }
    setUnsavedChanges(true);
  };

  return (
    <div>
      {showAllTickers ? (
        <>
          <MobileAllTickers
            selectedTicker={selectedTicker}
            tickersData={tickersData}
            onTickerSelect={handleTickerSelect}
            setshowAllTickers={setshowAllTickers}
          />
        </>
      ) : (
        <MobileEditorPage
          editedticker={editedticker}
          setEditedTicker={setEditedTicker}
          creator={creator}
          tickersData={tickersData}
          setTickersData={setTickersData}
          saveChanges={saveChanges}
          addNewTicker={addNewTicker}
          deleteTicker={deleteTicker}
          selectedTicker={selectedTicker}
          emptyPosition={emptyPosition}
          onTickerSelect={handleTickerSelect}
          setshowAllTickers={setshowAllTickers}
        />
      )}
    </div>
  );
};

export default MobileLayout;
