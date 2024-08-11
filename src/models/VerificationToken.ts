import { Model, models, model, Document, Schema } from "mongoose"

export interface IVerificationToken extends Document {
  email: string
  token: string
  expired: Date
}

const VerificationTokenSchema = new Schema<IVerificationToken>({
  email: {
    type: String,
    require: true,
    unique: true,
    trim: true,
  },
  token: { type: String, required: true, unique: true },
  expired: { type: Date },
})

const VerificationTokenModel =
  models?.VerificationToken ||
  model("VerificationToken", VerificationTokenSchema)

export default VerificationTokenModel as Model<IVerificationToken>
