import connectMongo from "@/lib/db"
import { createClient } from "@/lib/supabase/server"
import PositionModel, { IPosition } from "@/models/Position"
import UserModel from "@/models/User"
import { Position } from "@/types"
import { getUser } from "@/utils/supabase-helpers/queries"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const { user } = await getUser(supabase)
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }

    const { changes }: { changes: IPosition[] } = await req.json()

    await connectMongo()
    // Fetch existing positions to identify which ones need updates or deletions
    const existingPositions = await PositionModel.find({ creator: user.id })

    const existingIds = new Set(
      existingPositions.map((pos: Position) => pos._id!.toString())
    )

    // Track IDs for bulk operations using 'any' type for simplicity
    const updateOps: any[] = []
    const insertOps: any[] = []
    const newPositions = []

    // Prepare operations for each change
    changes.forEach((change) => {
      if (change._id && existingIds.has(change._id.toString())) {
        updateOps.push({
          updateOne: {
            filter: { _id: change._id, creator: user.id },
            update: { $set: change },
          },
        })
        existingIds.delete(change._id.toString())
      } else if (!change._id) {
        change.creator = user.id
        insertOps.push({
          insertOne: {
            document: change,
          },
        })
        newPositions.push(change)
      }
    })

    const deleteOps =
      existingIds.size > 0
        ? [
            {
              deleteMany: {
                filter: { _id: { $in: Array.from(existingIds) } },
              },
            },
          ]
        : []

    // Execute all prepared operations in bulk
    const bulkOps = [...updateOps, ...insertOps, ...deleteOps]
    if (bulkOps.length > 0) {
      const result = await PositionModel.bulkWrite(bulkOps)
      console.log(result)

      if (result.insertedCount > 0) {
        const insertedIds = insertOps.map((op) => op.insertOne.document._id)
        await UserModel.updateOne(
          { userId: user.id },
          { $push: { positions: { $each: insertedIds } } }
        )
      }
    }

    // Remove deleted IDs from UserModel if any
    if (deleteOps.length > 0) {
      await UserModel.updateOne(
        { userId: user.id },
        { $pull: { positions: { $in: Array.from(existingIds) } } }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Positions updated successfully",
    })
  } catch (error: any) {
    console.error("Error updating positions:", error)
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
