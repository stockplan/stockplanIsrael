import { Document, Model, Schema, model, models } from "mongoose"
import { IPosition } from "./Position"

export interface ITicker extends Document {
  ticker: string
  actualPrice: number
  positions?: IPosition[]
  isValid: boolean
}

const TickerSchema = new Schema<ITicker>({
  ticker: { type: String, unique: true, trim: true, require: true },
  actualPrice: { type: Number },
  positions: [{ type: Schema.Types.ObjectId, ref: "Position", require: false }],
  isValid: { type: Boolean, default: true },
})

const TickerModel = models?.Ticker || model("Ticker", TickerSchema)

export default TickerModel as Model<ITicker>
