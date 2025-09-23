const path = require("path");

// Required External Modules
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config();
const ApiError = require("./utils/api-error");
const globalErrorHandler = require("./middlewares/error-handler.middleware");
const dbConnection = require("./config/database");

// Routes
const categoryRoutes = require("./routes/category.route");
const subCategoryRoutes = require("./routes/subcategory.route");
const brandRoutes = require("./routes/brand.route");
const productRoutes = require("./routes/product.route");

// Establish Database Connection
dbConnection();

// App Configuration
const app = express();

// Middlewares
// parse JSON Request Bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

// HTTP Request Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/subcategories", subCategoryRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/products", productRoutes);

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
