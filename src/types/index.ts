import { ComponentType, type JSX } from "react";

export enum ColumnNames {
  Ticker = "ticker",
  ActualPrice = "actualPrice",
  PositionType = "positionType",
  Quantity = "quantity",
  AskPrice = "askPrice",
  Cost = "cost",
  ExitPrice = "exitPrice",
  ExpectedProfit = "expectedProfit",
  ExpectedProfitPercent = "expectedProfitPercent",
  StopLoss = "stopLoss",
  ExpectedLoss = "expectedLoss",
  ExpectedLossPercent = "expectedLossPercent",
}
export interface IRoute {
  path: string
  name: string
  layout?: string
  exact?: boolean
  component?: ComponentType
  disabled?: boolean
  icon?: JSX.Element
  secondary?: boolean
  collapse?: boolean
  items?: IRoute[]
  rightElement?: boolean
  invisible?: boolean
}

export interface Position {
  _id?: string
  creator?: string
  ticker: string
  positionType: string
  quantity: number
  actualPrice: number
  askPrice: number
  cost: number
  exitPrice: number
  expectedProfit: number
  expectedProfitPercent: number
  stopLoss: number
  expectedLoss: number
  expectedLossPercent: number
  daysLeft?: number
  entryDate?: string
}

export interface ContactMessage {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  description: string
}
