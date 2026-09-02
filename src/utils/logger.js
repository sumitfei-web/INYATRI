import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Define symbols for each log level
const LOG_SYMBOLS = {
    info: "✅",
    warn: "⚠️",
    error: "❌",
};

// Custom format to add symbols in JSON
const jsonWithSymbolsFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
        return JSON.stringify({
            timestamp,
            level,
            message: `${LOG_SYMBOLS[level] || ""} ${message}`,
        });
    })
);

// Info log file (Rotates daily)
const infoTransport = new DailyRotateFile({
    filename: "logs/info-%DATE%.log",
    level: "info",
    datePattern: "YYYY-MM-DD",
    maxFiles: "15d",
    zippedArchive: true,
    format: jsonWithSymbolsFormat, // Ensures JSON format
});

// Console transport (color + JSON)
const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), jsonWithSymbolsFormat),
});

// Create logger
const logger = winston.createLogger({
    transports: [infoTransport, consoleTransport],
});

export default logger;