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

    jwtSecret: process.env.JWT_SECRET || 'dev_only_insecure_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

//   llmProvider: process.env.LLM_PROVIDER || 'ollama',

//   ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
//   ollamaModel: process.env.OLLAMA_MODEL || 'llama3.1:8b',
//   ollamaEmbedModel: process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text',

//   groqApiKey: process.env.GROQ_API_KEY || '',
//   groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',

//   ragTopK: Number(process.env.RAG_TOP_K) || 5,
//   ragChunkSize: Number(process.env.RAG_CHUNK_SIZE) || 500,
//   ragChunkOverlap: Number(process.env.RAG_CHUNK_OVERLAP) || 50,
//   vectorIndexName: process.env.VECTOR_INDEX_NAME || 'knowledge_vector_index',


    isProduction: process.env.NODE_ENV === "production",
    isTest: process.env.NODE_ENV === "test",

        

};