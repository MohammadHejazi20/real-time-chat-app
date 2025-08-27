// WebSocket server configuration
export const SERVER_CONFIG = {
  // Server Configuration
  PORT: parseInt(process.env.PORT || "3001"),
  NODE_ENV: process.env.NODE_ENV || "development",
  HOST: process.env.HOST || "localhost",

  // WebSocket Configuration
  WS_PATH: process.env.WS_PATH || "/ws",
  MAX_CONNECTIONS: parseInt(process.env.MAX_CONNECTIONS || "1000"),
  HEARTBEAT_INTERVAL: parseInt(process.env.HEARTBEAT_INTERVAL || "30000"),

  // Redis Configuration (if using Redis for pub/sub)
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: parseInt(process.env.REDIS_PORT || "6379"),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
  REDIS_DB: parseInt(process.env.REDIS_DB || "0"),

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  LOG_FORMAT: process.env.LOG_FORMAT || "json",

  // Security
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  CORS_ENABLED: process.env.CORS_ENABLED === "true",
} as const;

// Environment validation
export function validateConfig() {
  // Validate that the configuration is properly constructed
  // The SERVER_CONFIG object already provides sensible defaults
  if (!SERVER_CONFIG.PORT || !SERVER_CONFIG.NODE_ENV) {
    throw new Error(
      "Invalid server configuration: PORT and NODE_ENV must be defined"
    );
  }

  return SERVER_CONFIG;
}
