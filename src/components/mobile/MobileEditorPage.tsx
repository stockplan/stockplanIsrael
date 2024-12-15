"use client"

import React from "react"
import { Button } from "../ui/button"
import MobileMainTicker from "./MobileMainTicker"
import Totals from "@/app/home/calculator/_components/totals"
import MobileSubTickers from "./MobileSubTickers"
import Logo from "../logo"
import { useLossProfitState } from "./useLossprofitState"
import AddTickerBtn from "./AddTickerBtn"

interface MobileEditorPageProps {}

const MobileEditorPage: React.FC<MobileEditorPageProps> = ({}) => {
  const { tickersData, creator, handleTickerSelect } = useLossProfitState()
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
          <MobileMainTicker />
        </div>
      </div>
    </>
  )
}

export default MobileEditorPage
