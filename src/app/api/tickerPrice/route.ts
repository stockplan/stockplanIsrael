import { NextRequest, NextResponse } from "next/server"

const fetchStockPrice = async (ticker: string) => {
  const API_URL = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.API_KEY}`
  try {
    const response = await fetch(API_URL)

    const data = await response.json()
    if (!data.c) {
      throw new Error("No price available")
    }
    return { price: data.c }
  } catch (error: unknown) {
    console.error(`Failed to fetch stock price for ${ticker}: ${error}`)
    // return { price: 0 }
    throw new Error(`Failed to fetch stock price for ${ticker}: ${error}`)
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const ticker = searchParams.get("ticker")

  if (!ticker || !/^[A-Z]*$/.test(ticker)) {
    return NextResponse.json({ error: "No ticker provided" }, { status: 400 })
  }

  try {
    const res = await fetchStockPrice(ticker)

    return NextResponse.json({ fetchedPrice: res.price }, { status: 200 })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
