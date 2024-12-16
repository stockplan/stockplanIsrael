import connectMongo from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import PositionModel from "@/models/Position";
import UserModel from "@/models/User";
import { getUser } from "@/utils/supabase-helpers/queries";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { user } = await getUser(supabase);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    await connectMongo();

    // Create a new ticker with default values and associate it with the authenticated user
    const newTicker = await PositionModel.create({
      ticker: "", // empty ticker by default
      positionType: "buy",
      quantity: 0,
      actualPrice: 0,
      askPrice: 0,
      cost: 0,
      exitPrice: 0,
      expectedProfit: 0,
      expectedProfitPercent: 0,
      stopLoss: 0,
      expectedLoss: 0,
      expectedLossPercent: 0,
      creator: user.id, // Use the authenticated user as the creator
    });

    // Optionally, update the User model with the new position
    await UserModel.updateOne(
      { userId: user.id },
      { $push: { positions: newTicker._id } }
    );

    return NextResponse.json({
      success: true,
      message: "Ticker added successfully",
      newTicker, // Send back the created ticker (including MongoDB-generated _id)
    });
  } catch (error: any) {
    console.error("Error adding ticker:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add ticker",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
