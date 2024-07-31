import mongoose, { Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  quantity: number;
  category: { type: mongoose.Schema.Types.ObjectId; ref: "category" };
}

export const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
});

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
