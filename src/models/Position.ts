import { Schema, model, models, Document, Model } from "mongoose"

export interface IPosition extends Document {
  creator: string
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
}

const PositionSchema = new Schema<IPosition>(
  {
    creator: { type: String },
    ticker: { type: String, uppercase: true, default: "" },
    positionType: { type: String, enum: ["buy", "sell"], default: "buy" },
    quantity: { type: Number, default: 0 },
    actualPrice: { type: Number, default: 0 },
    askPrice: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    exitPrice: { type: Number, default: 0 },
    expectedProfit: { type: Number, default: 0 },
    expectedProfitPercent: { type: Number, default: 0 },
    stopLoss: { type: Number, default: 0 },
    expectedLoss: { type: Number, default: 0 },
    expectedLossPercent: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
    },
  }
)

const PositionModel = models?.Position || model("Position", PositionSchema)

export default PositionModel
