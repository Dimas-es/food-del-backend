import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'

// app config
const app = express()
const port = process.env.PORT || 4000

// middleware
app.use(helmet())
app.use(mongoSanitize())
app.use(express.json())

// Configure CORS for only your frontend
app.use(cors({
  origin: 'https://food-del-store.vercel.app', // Ganti dengan URL frontend Anda
  methods: ['GET', 'POST'],
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
app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))  // static folder for images
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

app.get("/", (req, res) => {
  res.send("API Working")
})

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`)
})
