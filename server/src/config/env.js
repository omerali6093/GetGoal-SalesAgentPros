import dotenv from "dotenv";

dotenv.config();

const required = ["MONGODB_URI"];

function getMissing() {
    return required.filter(
        (key) =>
            !process.env[key] ||
            process.env[key].trim() === ""
    );
}

export function assertRequiredEnv() {
    const missing = getMissing();

    if (missing.length > 0) {
        console.error(
            `[env] Missing required environment variable(s): ${missing.join(", ")}\n` +
            "[env] Create a .env file and add the required values."
        );

        process.exit(1);
    }
}

export const env = {
    nodeEnv: process.env.NODE_ENV || "development",

    port: Number(process.env.PORT) || 5000,

    clientOrigin:
        process.env.CLIENT_ORIGIN ||
        "http://localhost:5173",

    mongodbUri: process.env.MONGODB_URI,

    isProduction:
        process.env.NODE_ENV === "production",

    isTest:
        process.env.NODE_ENV === "test",
};