import mongoose from 'mongoose'

export default async function configDb() {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log("DB is connected")
  } catch (error) {
    console.error("DB connection failed:", error.message)
  }
}

