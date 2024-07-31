import { Request, Response } from "express";
import { Product } from "../models/Product.model";
async function addProduct(req: Request, res: Response) {
  const { name, quantity, category } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Product name is required" });
  }

  try {
    // Create a new Product document
    const newProduct = new Product({ name, quantity, category });

    // Save the Product to the database
    await newProduct.save();

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Failed to add Product:", error);
    return res.status(500).json({ error: "Failed to add Product" });
  }
}

async function getProducts(req: Request, res: Response) {
  try {
    const Products = await Product.find();
    return res.status(200).json(Products);
  } catch (error) {
    console.error("Failed to get Products:", error);
    return res.status(500).json({ error: "Failed to get Products" });
  }
}

async function getProduct(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const Gproduct = await Product.findById(id);
    if (!Gproduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json(Gproduct);
  } catch (error) {
    console.error("Failed to get Product:", error);
    return res.status(500).json({ error: "Failed to get Product" });
  }
}

async function updateProduct(req: Request, res: Response) {
  // const { id } = req.params;
  const { _id, name, quantity, category } = req.body;

  if (!(name || quantity || category)) {
    return res.status(400).json({ error: "Product name is required" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      {
        name,
        quantity,
        category,
      },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Failed to update Product:", error);
    return res.status(500).json({ error: "Failed to update Product" });
  }
}

async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Failed to delete Product:", error);
    return res.status(500).json({ error: "Failed to delete Product" });
  }
}

async function getProductsByCategories(req: Request, res: Response) {
  try {
    const productsGroupedByCategory = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: "$categoryDetails",
      },
      {
        $group: {
          _id: "$categoryDetails._id",
          categoryName: { $first: "$categoryDetails.name" },
          products: {
            $push: {
              _id: "$_id",
              name: "$name",
              quantity: "$quantity",
            },
          },
          productCount: { $sum: 1 }, // Count the number of products in each category
        },
      },
      {
        $sort: { productCount: -1 }, // Sort categories by the number of products in descending order
      },
      {
        $project: {
          _id: 0,
          categoryId: "$_id",
          categoryName: 1,
          products: 1,
          productCount: 1, // Include the product count in the output if needed
        },
      },
    ]);

    res.json(productsGroupedByCategory);
  } catch (error) {
    console.error("Failed to fetch products grouped by category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategories,
};
