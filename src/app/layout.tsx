import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { getURL } from "@/utils/helpers"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

const title = "StocksPlan.com - QA"
const description =
  "Stocksplan.com offers a suite of calculators and tools designed for traders in the US stock market to pre-plan their trading strategies. This website enables users to estimate potential profits and losses by utilizing various financial calculators, providing a comprehensive approach to stock market trading. Unlock Your Trading Potential with Smart Planning, Strategic Insights, and Comprehensive Market Strategies for Success."

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title,
  description,
  openGraph: {
    title: title,
    description,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body id={"root"} className={`${inter.className} relative `}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
