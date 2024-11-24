import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(express.json());

// Configure CORS
const allowedOrigins = [
  "https://food-del-store.vercel.app", // Frontend
  "https://food-del-admin-olive.vercel.app", // Admin
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies if needed
  })
);

// Add Cross-Origin-Resource-Policy header
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// Database Connection
try {
  connectDB();
  console.log("Database connected successfully");
} catch (error) {
  console.error("Database connection failed:", error.message);
}

// API Endpoints
app.use("/api/food", foodRouter);
app.use("/images", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static("uploads")); // Static folder for images
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Base Route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Start Server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
