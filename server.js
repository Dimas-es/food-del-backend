import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
// import helmet from "helmet";
// import mongoSanitize from "express-mongo-sanitize";

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Middleware
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'", "https://vercel.live"],
//         imgSrc: ["'self'", "data:", "https://food-del-backend-omega.vercel.app"],
//         connectSrc: ["'self'", "https://food-del-backend-omega.vercel.app"],
//       },
//     },
//   })
// );
// app.use(mongoSanitize());
app.use(express.json());

// Configure CORS
const allowedOrigins = [
  "https://food-del-store.vercel.app",
  "https://food-del-admin-olive.vercel.app",
  "http://localhost:4000",
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
    credentials: true,
  })
);

// Database Connection
connectDB();

// API Endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
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
