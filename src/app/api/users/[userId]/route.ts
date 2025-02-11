import connectMongo from "@/lib/db";
import { getEmptyRow } from "@/lib/utils";
import PositionModel, { IPosition } from "@/models/Position";
import UserModel from "@/models/User";
import { Position } from "@/types";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ userId: string }>;

export async function GET(_: NextRequest, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;

    const { userId } = params;

    if (!userId) {
      return NextResponse.json({ error: "No user founded" }, { status: 403 });
    }

    await connectMongo();

    let user = await UserModel.findOne({ userId }).populate("positions");

    if (!user) {
      user = new UserModel({
        userId,
        role: "user",
        maxTickers: 50,
      });
      await user.save();
    }

    let stocks = user.positions || [];

    if (stocks.length === 0) {
      const newPosition = new PositionModel(getEmptyRow(userId))
      const savedPosition = await newPosition.save()
      await UserModel.findOneAndUpdate({ userId }, { $push: { positions: savedPosition._id } })
      stocks = [savedPosition.toObject()]
    } else {
      stocks = stocks.map((stock: IPosition) => {
        const { _id, id, createdAt, updatedAt, ...rest } = stock.toObject({
          versionKey: false,
        })
        return stock.toObject({
          versionKey: false,
        })
      })
    }

    return NextResponse.json(stocks);
  } catch (error) {
    console.error("Error in GET /api/users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
