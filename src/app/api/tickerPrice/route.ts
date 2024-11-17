import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

const fetchPrimaryPrice = async (ticker: string): Promise<number> => {
  const url = `https://yftv-orpin-23.vercel.app/ticker/${ticker}`
  try {
    const { data } = await axios.get(url)

    if (!data.value || isNaN(Number(data.value))) {
      throw new Error("Invalid or missing price from primary API")
    }

    return Number(data.value)
  } catch (error) {
    console.error(`Error fetching price from primary API for ${ticker}:`, error)
    throw new Error("Primary API fetch failed")
  }
}

const fetchSecondaryPrice = async (ticker: string): Promise<number> => {
  const API_URL = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.API_KEY}`
  try {
    const { data } = await axios.get(API_URL)

    if (!data.c || isNaN(Number(data.c))) {
      throw new Error("Invalid or missing price from secondary API")
    }

    return Number(data.c)
  } catch (error) {
    console.error(
      `Error fetching price from secondary API for ${ticker}:`,
      error
    )
    throw new Error("Secondary API fetch failed")
  }
}

const fetchPriceWithFallback = async (ticker: string): Promise<number> => {
  try {
    return await fetchPrimaryPrice(ticker)
  } catch (primaryError) {
    console.warn(`Primary API failed for ${ticker}. Attempting secondary API.`)
    return await fetchSecondaryPrice(ticker)
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const ticker = searchParams.get("ticker")

  if (!ticker || !/^[A-Z]+$/.test(ticker)) {
    return NextResponse.json(
      { error: "Invalid or missing ticker" },
      { status: 400 }
    )
  }

  try {
    const price = await fetchPriceWithFallback(ticker)
    return NextResponse.json({ fetchedPrice: price }, { status: 200 })
  } catch (error) {
    console.error(`Failed to fetch price for ${ticker}:`, error)
    return NextResponse.json(
      { error: "Failed to fetch stock price" },
      { status: 500 }
    )
  }
}
