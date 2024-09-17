import { columns } from "@/components/position/columns"
import { TableLossProfit } from "@/components/position/table-lossprofit"
import { getEmptyRow } from "@/lib/utils"
import { redirect } from "next/navigation"
import getServerUser from "@/utils/auth-helpers/getServerUser"
import { getInitialData } from "@/utils"
import LandscapePopUp from "@/components/LandscapePopUp"
import TableLossProfitWrapper from "../_components/table-wrapper"

const Page = async () => {
  const {
    data: { user },
    error,
  } = await getServerUser()

  if (error && user) return redirect("/home")

  const creator = user?.id || ""

  const serverUserStocks = creator
    ? await getInitialData(creator)
    : [getEmptyRow("")]

  return (
    <div className="pt-8">
      <TableLossProfitWrapper
        columns={columns}
        creator={creator}
        serverUserStocks={serverUserStocks}
      />
      <LandscapePopUp />
    </div>
  )
}

export default Page
