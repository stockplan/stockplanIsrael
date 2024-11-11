import connectMongo from "@/lib/db"
import PositionModel from "@/models/Position"
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
