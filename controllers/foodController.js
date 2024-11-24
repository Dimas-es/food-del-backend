import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";

const addFood = async (req, res) => {
  try {
    if (!req.file) throw new Error("Image is required");

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.file.filename,
    });

    await food.save();
    res.status(201).json({ success: true, message: "Food Added" });
  } catch (error) {
    console.error("Error in addFood:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

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
