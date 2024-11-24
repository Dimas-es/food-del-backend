import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";

// Fungsi untuk menambah makanan
const addFood = async (req, res) => {
  try {
    // Jika file tidak ada, lempar error
    if (!req.file) throw new Error("Image file is required");

    // Membuat objek makanan baru dan menyimpan data
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.file.filename, // Menyimpan nama file gambar
    });

    // Menyimpan data ke database
    await food.save();
    
    // Mengirim respons sukses
    res.status(201).json({ success: true, message: "Food Added" });
  } catch (error) {
    // Menangani error dan memberikan respons
    console.error("Error in addFood:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Route untuk menambahkan makanan
// foodRouter.post("/add", upload.single("image"), addFood);


const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.status(200).json({ success: true, data: foods });
  } catch (error) {
    console.error("Error in listFood:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) throw new Error("Food not found");

    const filePath = path.resolve("uploads", food.image);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await foodModel.findByIdAndDelete(req.body.id);
    res.status(200).json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.error("Error in removeFood:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addFood, listFood, removeFood };
