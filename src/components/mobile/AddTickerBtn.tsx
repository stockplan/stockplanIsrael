import React from "react"
import { Button } from "../ui/button"
import { useLossProfitState } from "./useLossprofitState"

interface AddTickerBtnProps {}

const AddTickerBtn: React.FC<AddTickerBtnProps> = ({}) => {
  const { addNewTicker } = useLossProfitState()
  return (
    <Button className="bg-gray-700 w-full" onClick={() => addNewTicker()}>
      + Add empty Ticker
    </Button>
  )
}

export default AddTickerBtn
