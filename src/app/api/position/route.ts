import connectMongo from "@/lib/db"
import { createClient } from "@/lib/supabase/server"
import { checkAdmin } from "@/lib/utils"
import PositionModel from "@/models/Position"
import { getUser } from "@/utils/supabase-helpers/queries"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    await connectMongo()

    const stocks = await PositionModel.find()

    return NextResponse.json({ success: true, data: stocks })
  } catch (error: any) {
    console.error("Error getting positions:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
        error: error.message,
      },
      { status: 500 }
    )
  }
}
