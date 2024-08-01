import express, { Request, Response } from "express";
import cors from "cors";
import connectToDatabase from "./db/dal";
import categoryRoutes from "./routes/category-routs";
import productRoutes from "./routes/product-routes";

const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

app.listen(PORT, () => {
  connectToDatabase();
  console.log(`Server is running on http://localhost:${PORT}`);
});
