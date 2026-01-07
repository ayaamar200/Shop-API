// Required External Modules
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import express, { json } from "express";
import cors from "cors";
import compression from "compression";
import { config } from "dotenv";
import morgan from "morgan";

config();
import ApiError from "./utils/api-error.js";
import globalErrorHandler from "./middlewares/error-handler.middleware.js";
import dbConnection from "./config/database.js";

// Routes
import mountRoutes from "./routes/index.js";
import cookieParser from "cookie-parser";
import assignGuestId from "./middlewares/assignGuestId.middleware.js";

import { webhookCheckout } from "./services/order.service.js";

// Establish Database Connection
dbConnection();

// App Configuration
const app = express();
app.post(
  "/webhook-checkout",
  express.raw({
    type: "application/json",
  }),
  webhookCheckout
);

// Secure CORS configuration - whitelist approach
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [];

// In development, allow localhost origins
if (process.env.NODE_ENV === "development") {
  allowedOrigins.push(
    "http://localhost:3000",
    "http://localhost:4200",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:4200",
    "http://localhost:4000",
    "http://127.0.0.1:4000"
  );
}

// Enable CORS for all routes
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, curl)
      if (!origin) return callback(null, true);

      // Check if origin is in whitelist
      if (allowedOrigins.length === 0) {
        // If no origins configured, allow all (not recommended for production)
        console.warn(
          "WARNING: No ALLOWED_ORIGINS configured. Allowing all origins."
        );
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Origin not allowed
      return callback(
        new Error(`CORS blocked: ${origin} is not allowed. Configure ALLOWED_ORIGINS in .env`)
      );
    },
    credentials: true,
  })
);

app.options("/{*splat}", cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
}));
// compress all responses
app.use(compression());

app.use(json());

// Middlewares
// parse JSON Request Bodies
app.use(cookieParser());
app.use(assignGuestId); // This ensures guestId is always set

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files
app.use(express.static(join(__dirname, "uploads")));

// HTTP Request Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
mountRoutes(app);

// Handle Undefined Routes
app.all("/{*splat}", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global Error Handler
app.use(globalErrorHandler);

// Server Activation
const port = process.env.PORT || 4000; // Define server port (default: 3000)
const server = app.listen(port,'0.0.0.0', () => {
  console.log(`App running on port ${port}`);
});

// Unhandled Promise Rejection Handler ( e.g., database connection failure) (Outside Express)
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting down...");
    process.exit(1);
  });
});
