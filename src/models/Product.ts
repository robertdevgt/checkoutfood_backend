import mongoose, { Document, Schema, Types } from "mongoose";

const productCategory = {
    FOOD: 'food',
    COFFES: 'coffes',
    CAKES: 'cakes',
    DRINKS: 'drinks',
} as const;

export type ProductCategory = typeof productCategory[keyof typeof productCategory]

export interface IProduct extends Document {
    _id: Types.ObjectId;
    price: number;
    name: string;
    category: ProductCategory;
    description: string;
    status: boolean;
    img: string;
    restaurant: Types.ObjectId;
}

const productSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: Object.values(productCategory),
        required: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    restaurant: {
        type: Types.ObjectId,
        ref: 'Restaurant'
    }
});

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product