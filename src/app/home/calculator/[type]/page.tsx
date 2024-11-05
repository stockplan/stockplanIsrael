import LandscapePopUp from "@/components/LandscapePopUp"
import { columns } from "@/app/home/calculator/_components/columns"
import { TableLossProfit } from "@/app/home/calculator/_components/table-lossprofit"
import { createClient } from "@/lib/supabase/server"
import { getEmptyRow } from "@/lib/utils"
import { getInitialData } from "@/utils"
import { getUser } from "@/utils/supabase-helpers/queries"
import { redirect } from "next/navigation"
import React from "react"

interface CalcPageProps {
  params: Promise<{ type: string }>
}

const TablePage = async ({ params }: CalcPageProps) => {
  const supabase = await createClient()

  const { user, error } = await getUser(supabase)

  if (error && user) return redirect("/home")

  const { type } = await params

  switch (type) {
    case "lossprofit":
      const creator = user?.id || ""

      const serverUserStocks = creator
        ? await getInitialData(creator)
        : [getEmptyRow("")]

      return (
        <TableLossProfit
          columns={columns}
          creator={creator}
          serverUserStocks={serverUserStocks}
        />
      )
    default:
      return <div className="CalcPage">Table now found {type}</div>
  }
}

export default TablePage
