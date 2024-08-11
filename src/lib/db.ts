import mongoose from "mongoose"

//prettier-ignore
const MONGO_URI =  process.env.MONGODB_URI

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  )
}

const cached: {
  connection?: typeof mongoose
  promise?: Promise<typeof mongoose>
} = {}

async function connectMongo() {
  if (cached.connection) {
    return cached.connection
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }
    cached.promise = mongoose.connect(MONGO_URI!, opts).then((mongoose) => {
      console.log("🚀 Successfully connected to database")
      return mongoose
    })
  }
  try {
    cached.connection = await cached.promise
  } catch (e) {
    cached.promise = undefined
    console.log("🔴 Failed to connect to MongoDB:", (e as Error).message)
    throw e
  }
  return cached.connection
}

export default connectMongo
