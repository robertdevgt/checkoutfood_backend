import mongoose, { Document, PopulatedDoc, Schema, Types } from "mongoose";
import { IOrderItem } from "./OrderItem";
import { IUser } from "./User";
import { IRestaurant } from "./Restaurant";

const orderStatuses = {
    PREPARING: 'preparing',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
} as const;

export type OrderStatuses = typeof orderStatuses[keyof typeof orderStatuses]


export interface IOrder {
    _id: Types.ObjectId;
    items: PopulatedDoc<IOrderItem & Document>[];
    user: PopulatedDoc<IUser & Document>;
    restaurant: PopulatedDoc<IRestaurant & Document>;
    notes: string;
    total: number;
    formatted_address: string;
    latitude: number;
    longitude: number;
    status: OrderStatuses;
}

const orderSchema: Schema = new Schema({
    total: {
        required: true,
        type: Number
    },
    items: [
        {
            type: Types.ObjectId,
            ref: 'OrderItem'
        }
    ],
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    formatted_address: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        enum: Object.values(orderStatuses),
        required: true,
        default: "preparing"
    },
});

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;