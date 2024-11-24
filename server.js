import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config';
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());

// Content-Security-Policy Header untuk mengizinkan skrip dan gambar dari domain tertentu
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", `
    default-src 'none';
    script-src 'self' https://food-del-store.vercel.app https://food-del-admin-olive.vercel.app https://vercel.live;
    img-src 'self' https://food-del-backend-omega.vercel.app https://food-del-store.vercel.app https://food-del-admin-olive.vercel.app;
    style-src 'self' https://food-del-store.vercel.app https://food-del-admin-olive.vercel.app;
    connect-src 'self';
    font-src 'self';
    frame-src 'none';
  `);
  next();
});

// Configure CORS for only your frontend
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://food-del-store.vercel.app',
      'https://food-del-admin-olive.vercel.app',
      'http://localhost:3000' // Tambahkan jika perlu untuk pengembangan lokal
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add CORP header to all responses
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');  // Atau 'same-origin' jika diperlukan
  next();
});

// db connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));  // static folder for images
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
