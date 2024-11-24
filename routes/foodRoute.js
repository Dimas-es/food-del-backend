import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import path from "path";
import fs from "fs";
// import  from "../middleware/auth.js"; // Pastikan  benar

const foodRouter = express.Router();

// Buat folder "uploads" jika belum ada
const uploadFolder = path.resolve("uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true }); // Recursive untuk subfolder
}

// Multer Storage Engine untuk Upload Gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder); // Folder tempat file akan disimpan
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Format nama file
  },
});

// Middleware multer untuk upload file
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png) are allowed!"));
    }
  },
});

// Route untuk menambahkan makanan
foodRouter.post("/add",  upload.single("image"), async (req, res, next) => {
  try {
    console.log("Request Body:", req.body); // Debugging
    console.log("Uploaded File:", req.file); // Debugging

    await addFood(req, res); // Panggil controller
  } catch (error) {
    console.error("Error in /add route:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route untuk mendapatkan daftar makanan
foodRouter.get("/list", async (req, res, next) => {
  try {
    await listFood(req, res); // Panggil controller
  } catch (error) {
    console.error("Error in /list route:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route untuk menghapus makanan
foodRouter.post("/remove", async (req, res, next) => {
  try {
    await removeFood(req, res); // Panggil controller
  } catch (error) {
    console.error("Error in /remove route:", error);
    res.status(500).json({ error: error.message });
  }
});

// Middleware Error Handling Khusus untuk foodRouter
foodRouter.use((err, req, res, next) => {
  console.error("Error in foodRouter:", err);
  res.status(500).json({ error: err.message });
});

export default foodRouter;
