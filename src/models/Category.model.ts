import mongoose, { Schema, Document } from "mongoose";

export interface CategoryType extends Document {
  name: string;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
});

export const Category = mongoose.model<CategoryType>(
  "category",
  CategorySchema
);
