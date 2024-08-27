import { getURL } from "./helpers"

export async function fetchStockPrice(ticker: string): Promise<{
  ticker: string
  price: number
}> {
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

export async function getInitialData(userId: string) {
  try {
    const redirectUrl = getURL(`/api/users/${userId}`)
    const response = await fetch(redirectUrl)
    if (!response.ok) {
      console.error(`Error: ${response.statusText}`)
      return []
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Expected JSON response but got:", contentType)
      const text = await response.text()
      console.error("Response body:", text)
      return []
    }

    const stocks = await response.json()
    return stocks
  } catch (error) {
    console.error("Error fetching initial data:", error)
    return []
  }
}

export function hasDataChanged(arr1: unknown[], arr2: unknown[]) {
  return JSON.stringify(arr1) === JSON.stringify(arr2)
}
