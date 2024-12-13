"use client"

import React from "react"
import { Button } from "../ui/button"
import MobileMainTicker from "./MobileMainTicker"
import Totals from "@/app/home/calculator/_components/totals"
import { Position } from "@/types"
import MobileSubTickers from "./MobileSubTickers"
import Logo from "../logo"
import { useUnsavedChangesContext } from "@/hooks/useUnsavedChangesContext"
import { useLossProfitState } from "./useLossprofitState"
import AddTickerBtn from "./AddTickerBtn"

interface MobileEditorPageProps {
  saveChanges: (changes: Position[]) => void
}

const MobileEditorPage: React.FC<MobileEditorPageProps> = ({ saveChanges }) => {
  const { tickersData, creator, deleteTicker, handleTickerSelect } =
    useLossProfitState()
  const { unsavedChanges, setUnsavedChanges } = useUnsavedChangesContext()
  return (
    <>
      <div className="p-4 bg-gray-800 text-white">
        <div className="flex justify-between mb-4 gap-3">
          {creator && (
            <>
              <Button
                className="bg-gray-700"
                onClick={() => handleTickerSelect(null)}
              >
                See all Tickers
              </Button>
              <div className="overflow-x-auto w-full max-w-full">
                <MobileSubTickers
                  tickersData={tickersData}
                  onTickerSelect={handleTickerSelect}
                />
              </div>
            </>
          )}
        </div>

        <div className="bg-gray-900 p-4 rounded-md">
          <div>
            <Logo isNavigate={false} />
            <h2 className="text-xl font-semibold mt-2">
              Quick Profit & Loss Calculator
            </h2>
          </div>
          <MobileMainTicker />
        </div>

        {unsavedChanges && creator ? (
          <div className="mt-4 flex justify-center">
            <Button
              className="bg-blue-600 w-full"
              onClick={() => saveChanges(tickersData)}
            >
              Save Changes
            </Button>
          </div>
        ) : null}

        <div className="mt-6 flex justify-center">
          <AddTickerBtn />
        </div>

        <div className="flex justify-between items-center mt-4">
          {creator && (
            <button
              onClick={() => deleteTicker()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          )}
          <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
            Reset
          </button>
        </div>

        <Totals tableData={tickersData} />
      </div>
    </>
  )
}

export default MobileEditorPage
