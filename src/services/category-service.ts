import { Request, Response } from "express";
import { Category } from "../models/Category.model";
async function addCategory(req: Request, res: Response) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  try {
    // Create a new category document
    const newCategory = new Category({ name });

    // Save the category to the database
    await newCategory.save();

    return res
      .status(201)
      .json({ message: `Category "${name}" added successfully.` });
  } catch (error) {
    console.error("Failed to add category:", error);
    return res.status(500).json({ error: "Failed to add category" });
  }
}

async function getCategorys(req: Request, res: Response) {
  try {
    const category = await Category.find();
    return res.status(200).json(category);
  } catch (error) {
    console.error("Failed to get category:", error);
    return res.status(500).json({ error: "Failed to get category" });
  }
}

export { addCategory, getCategorys };
