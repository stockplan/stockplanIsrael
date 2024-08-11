import connectMongo from "@/lib/db"
import { createClient } from "@/lib/supabase/server"
import PositionModel, { IPosition } from "@/models/Position"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No user founded" }, { status: 403 })
    }

    const { positions } = await req.json()

    const userId = user.id
    await connectMongo()

    let updatedPositions: IPosition[] = await Promise.all(
      positions.map(async (positionData: IPosition) => {
        if (positionData._id) {
          return await PositionModel.findByIdAndUpdate(
            positionData._id,
            { $set: positionData },
            { new: true }
          )
        } else {
          const newPosition = new PositionModel({
            ...positionData,
            creator: userId,
          })
          return await newPosition.save()
        }
      })
    )

    return NextResponse.json(updatedPositions)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
