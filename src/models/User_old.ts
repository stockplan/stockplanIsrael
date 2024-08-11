import { Model, models, model, Document, Schema } from "mongoose"

import bcrypt from "bcryptjs"
import { IPosition } from "./Position"

export interface IUser extends Document {
  userId?: string
  username: string
  email: string
  emailVerified?: Date
  lastLoginDate: Date
  password: string
  role: string
  positions?: IPosition[]
  maxTickers: number
  createdAt: Date
  isModified: (path: string) => boolean
}

interface Methods {
  comparePassword(password: string): Promise<boolean>
}

const UserSchema = new Schema<IUser, {}, Methods>(
  {
    userId: { type: String, required: false },
    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    emailVerified: {
      type: Date,
      unique: false,
    },
    username: { type: String, required: true, trim: true, unique: false },
    password: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    positions: [{ type: Schema.Types.ObjectId, ref: "Position", default: [] }],
    lastLoginDate: { type: Date },
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

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  try {
    this.password = await bcrypt.hash(this.password, 10)
    next()
  } catch (error) {
    throw error
  }
})

UserSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    throw error
  }
}

const UserModel = models?.User || model("User", UserSchema)

export default UserModel as Model<IUser, {}, Methods>
