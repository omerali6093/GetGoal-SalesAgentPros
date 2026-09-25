import { assertRequiredEnv, env } from "./config/env.js";
import createApp from "./app.js";
import { connectDB } from "./config/db.js";
import logger from "./utils/logger.js";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

assertRequiredEnv();

async function start() {
    try {
        await connectDB();

        const app = createApp();

        const server = app.listen(env.port, () => {
            logger.info(
                `[Server] GetGoal Sales AI backend listening on port ${env.port} (${env.nodeEnv})`
            );
        });

        const shutdown = (signal) => {
            logger.info(
                `[server] ${signal} received, shutting down gracefully...`
            );

            server.close(() => {
                logger.info("[server] HTTP server closed");
                process.exit(0);
            });
        };

        process.on("SIGINT", () => shutdown("SIGINT"));
        process.on("SIGTERM", () => shutdown("SIGTERM"));

    } catch (err) {
        logger.error("[server] Failed to start:", err);
        process.exit(1);
    }
}

start();