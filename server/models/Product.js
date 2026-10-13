import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    image: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String, required: true },
    brand: { type: String, required: true },
    quantityOptions: [{ type: String }],
    inStock: { type: Boolean, default: true },
    tags: [{ type: String }],
    specifications: {
      germinationRate: String,
      maturityDays: String,
      fruitWeight: String,
      season: String,
      sowingMethod: String
    }
  },
  { timestamps: true }
);

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
