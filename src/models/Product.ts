import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProduct extends Document {
    _id: Types.ObjectId;
    price: number;
    name: string;
    description: string;
    img: string;
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
    img: {
        type: String,
        required: true
    }
});

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product