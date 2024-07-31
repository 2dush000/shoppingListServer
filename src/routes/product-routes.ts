import express, { Request, Response } from "express";
import {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategories,
} from "../services/product-service";
import { Product } from "../models/Product.model";

const router = express.Router();

router.post("/", addProduct);
router.get("/", getProducts);
router.get("/byId/:id", getProduct);
router.put("/", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/productsByCategory", getProductsByCategories);
router.get(
  "/productsgroupedbycategory",
  async (req: Request, res: Response) => {
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
            productCount: { $sum: 1 },
          },
        },
        {
          $sort: { productCount: -1 },
        },
        {
          $project: {
            _id: 0,
            categoryId: "$_id",
            categoryName: 1,
            products: 1,
            productCount: 1,
          },
        },
      ]);

      res.json(productsGroupedByCategory);
    } catch (error) {
      console.error("Failed to fetch products grouped by category:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
