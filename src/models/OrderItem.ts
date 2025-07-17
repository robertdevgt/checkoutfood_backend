import { IOrder } from "./Order";
import { IProduct } from "./Product";
import mongoose, { Document, PopulatedDoc, Schema, Types } from "mongoose";

export interface IOrderItem {
    _id: Types.ObjectId;
    product: PopulatedDoc<IProduct & Document>;
    order: PopulatedDoc<IOrder & Document>;
    quantity: number;
    subtotal: number;
}

const orderItemSchema: Schema = new Schema({
    product: {
        type: Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    order: {
        type: Types.ObjectId,
        required: true,
        ref: 'Order'
    },
    quantity: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    }
});

export const OrderItem = mongoose.model<IOrderItem>('OrderItem', orderItemSchema);