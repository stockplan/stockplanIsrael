import connectMongo from "@/lib/db"
import { getEmptyRow } from "@/lib/utils"
import PositionModel, { IPosition } from "@/models/Position"
import UserModel from "@/models/User_old"
import { NextRequest, NextResponse } from "next/server"

type PriceData = {
  ticker: string
  price: number
}

async function fetchStockPrice(ticker: string): Promise<PriceData> {
  if (!ticker) return { ticker: "", price: 0 }
  const apiKey = process.env.API_KEY
  const API_URL = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`
  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      return { ticker: "", price: 0 }
    }
    const data = await response.json()
    if (!data.c) {
      throw new Error("No price available")
    }
    return { ticker, price: data.c }
  } catch (error) {
    console.error(`Failed to fetch stock price for ${ticker}: ${error}`)
    return { ticker: "", price: 0 }
  }
}

const updatePricesIfChanged = async (tickersWithPrices: PriceData[]) => {
  const tickers = tickersWithPrices.map((data) => data.ticker)
  const currentPrices = await PositionModel.find(
    { ticker: { $in: tickers } },
    { ticker: 1, actualPrice: 1 }
  ).lean()

  const updates: Promise<any>[] = []
  const changedPrices: PriceData[] = []

  tickersWithPrices.forEach((newPriceData) => {
    const currentPriceData = currentPrices.find(
      (p) => p.ticker === newPriceData.ticker
    )
    if (
      currentPriceData &&
      +currentPriceData.actualPrice !== +newPriceData.price
    ) {
      updates.push(
        PositionModel.updateMany(
          { ticker: newPriceData.ticker },
          { $set: { actualPrice: +newPriceData.price } }
        )
      )
      changedPrices.push(newPriceData)
    }
  })

  await Promise.all(updates)
}

type Params = { params: { userId: string } }

export async function GET(_: NextRequest, { params }: Params) {
  try {
    await connectMongo()

    const { userId } = params

    const user = await UserModel.findById(userId).populate("positions").lean()

    if (!user) {
      return NextResponse.json({ message: "User Not found" })
    }

    let userPositions: IPosition[] = user.positions || []

    if (userPositions.length === 0) {
      const emptyPosition = getEmptyRow(userId)
      const newPosition = new PositionModel(emptyPosition)
      const savedPosition = await newPosition.save()

      await UserModel.findOneAndUpdate(
        { _id: userId },
        { $push: { positions: savedPosition._id } }
      )

      userPositions = [savedPosition]
    } else {
      const tickers = Array.from(
        new Set(userPositions.map((position) => position.ticker))
      )
      const prices = await Promise.all(tickers.map(fetchStockPrice))

      await updatePricesIfChanged(prices)

      userPositions = await PositionModel.find({
        _id: { $in: user.positions },
      }).lean()
    }

    return NextResponse.json(userPositions)
  } catch (error) {
    console.error("Error in GET /api/positions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    console.log("Connection db in api/position/[userId] POST")

    await connectMongo()

    const userId = params.userId
    const { positions } = await req.json()

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
          await UserModel.findByIdAndUpdate(userId, {
            $push: { positions: newPosition._id },
          })
          return await newPosition.save()
        }
      })
    )

    // console.log({ updatedPositions })

    return NextResponse.json(updatedPositions)
  } catch (error: any) {
    console.error("Failed to update or create positions:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    console.log("Connection db in api/position/[userId] DELETE")

    await connectMongo()
    const positionIds = JSON.parse(await req.text())
    const userId = params.userId

    await PositionModel.deleteMany({ _id: { $in: positionIds } })

    await UserModel.findByIdAndUpdate(userId, {
      $pull: { positions: { $in: positionIds } },
    })

    console.log(`Positions deleted for user ${userId}: ${positionIds}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
