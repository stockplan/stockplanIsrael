"use client"

import React from "react"
import { Button } from "../ui/button"
import MobileMainTicker from "./MobileMainTicker"
import { useLossProfitState } from "./useLossprofitState"
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel"
import TickerPreview from "./TickerPreview"

interface MobileEditorPageProps {}

const MobileEditorPage: React.FC<MobileEditorPageProps> = ({}) => {
  const { tickersData, creator, handleTickerSelect } = useLossProfitState()
  return (
    <div className="p-4 bg-gray-800 text-white">
      <div className="flex justify-between mb-4 gap-3">
        {creator && (
          <>
            <Button className="bg-gray-700" onClick={() => handleTickerSelect(null)}>
              See all Tickers
            </Button>

            <div className="overflow-x-auto w-full max-w-full">
              <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent>
                  {tickersData?.map((item, index) => (
                    <CarouselItem key={`${item._id}-${index}`} className="md:basis-1/2 lg:basis-1/3">
                      <TickerPreview stock={item} onClick={() => console.log(item)} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </>
        )}
      </div>

      <div className="bg-gray-900 p-4 rounded-md">
        <MobileMainTicker />
      </div>
    </div>
  )
}

export default MobileEditorPage
