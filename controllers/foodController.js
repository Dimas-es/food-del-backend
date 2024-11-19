import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";

// Tambahkan food
const addFood = async (req, res) => {
  try {
    let image_filename = req.file.filename; // Pastikan file image berhasil diupload

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename,
    });

    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error adding food" });
  }
};

// Daftar semua makanan
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching food list" });
  }
};

// Hapus makanan
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    // Menghapus file gambar jika ada
    const filePath = path.resolve("uploads", food.image);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Menghapus file
    }

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error removing food" });
  }
};

export { addFood, listFood, removeFood };
