import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import authMiddleware from "../middleware/auth.js"; // Pastikan untuk mengimpor authMiddleware

const foodRouter = express.Router();

// Buat folder "uploads" jika belum ada
const uploadFolder = path.resolve("uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true }); // Menambahkan recursive agar membuat subfolder jika diperlukan
}

// Image storage engine
const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder); // Menggunakan path lengkap untuk folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: Storage });

foodRouter.post("/add", authMiddleware, upload.single("image"), addFood); // Menambahkan middleware auth
foodRouter.get("/list", listFood);
foodRouter.post("/remove", authMiddleware, removeFood); // Menambahkan middleware auth

export default foodRouter;
