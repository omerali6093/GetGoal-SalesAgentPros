import express from "express"
import helmet from "helmet"
import cors from "cors"
import morgan from "morgan"


import { env } from "./config/env.js"
import logger from './utils/logger.js'
import { success } from './utils/apiResponse.js'
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js'



export default function createApp() {
    const app = express();

    // Security and Parsing for server 
    app.use(helmet())
    app.use(
        cors({
            origin: env.clientOrigin,
            credentials: true,
        }),
    )
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true }));

    if(!env.isTest) {
        app.use(morgan(env.isProduction ? "combined" : "dev", {
            stream: { write: (msg) => logger.info(msg.trim()) },
        }))
    }

    // Health Checking(CHECKS API IS WORKING CORRECT OR NOT)
    app.get('/health', (req, res) => {
        success(res, {
            status: "ok",
            environment: env.nodeEnv,
            timeStamp: new Date().toISOString()
        })
    })


    // 404 + ERROR HANDLING
    app.use(notFoundHandler)
    app.use(errorHandler)

    return app

}