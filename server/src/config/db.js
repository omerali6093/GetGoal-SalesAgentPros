import mongoose from "mongoose";
import { env } from "./env.js";
import logger from "../utils/logger.js";

mongoose.set('strictQuery', true)

export async function connectDB() {
    try {
        await mongoose.connect(env.mongodbUri)
        logger.info('[db] Connected to MongoDB (${mongoose.connection.name})')
    } catch (err) {
        logger.error('[db] Error connecting to MongoDB:', err.message)
        throw err
    }

    mongoose.connect.on('disconnected', () => {
        logger.warn('[db] MongoDB disconnected')
    })

    mongoose.connect.on('error', (err) => {
        logger.error("[db] Mongodb connection error:", err.message)
    })
}


export async function disconnectDB() {
    await mongoose.disconnect()
}


export { mongoose}