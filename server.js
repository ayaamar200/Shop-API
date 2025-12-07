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

const allowedOrigins = [
  "http://localhost:4200", // local dev
  "https://electro-elhany.vercel.app", // production frontend
];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

// Enable CORS for all routes (Frontend)
// app.use(cors({}));
app.options("/{*splat}", cors({ origin: allowedOrigins, credentials: true }));
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
const port = process.env.PORT || 3000; // Define server port (default: 3000)
const server = app.listen(port, () => {
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
