import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { getURL } from "@/utils/helpers"
import { UnsavedChangesProvider } from "@/hooks/useUnsavedChangesContext"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

const title = "Plan Your Trade - Stock Market Tools for Traders";
const description =
  "Plan Your Trade offers a suite of calculators and tools designed for traders in the US stock market to pre-plan their trading strategies. This website enables users to estimate potential profits and losses by utilizing various financial calculators, providing a comprehensive approach to stock market trading.";

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title,
  description,
  openGraph: {
    title: title,
    description: description,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-background-main md:bg-main bg-mobileMain  bg-no-repeat md:bg-[left_bottom_-80px] `}
      >
        <UnsavedChangesProvider>
          <Header />
          <div className=" min-h-[calc(100%-97px)]  ">{children}</div>
        </UnsavedChangesProvider>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
