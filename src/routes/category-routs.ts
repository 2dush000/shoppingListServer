import express from "express";
import { addCategory, getCategorys } from "../services/category-service";

const router = express.Router();

router.post("/", addCategory);
router.get("/", getCategorys);

export default router;
