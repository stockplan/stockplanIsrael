import { Position } from "@/schemas"
import { Model, models, model, Schema } from "mongoose"

export interface IUser {
  userId?: string
  email: string
  role: string
  positions?: Position[]
  maxTickers: number
}

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, required: false },
    email: { type: String, required: false },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    positions: [{ type: Schema.Types.ObjectId, ref: "Position", default: [] }],
    maxTickers: { type: Number, default: 50 },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
    },
  }
)

const UserModel = models?.User || model("User", UserSchema)

export default UserModel as Model<IUser>
