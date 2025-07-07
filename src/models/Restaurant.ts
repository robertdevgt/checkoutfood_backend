import mongoose, { Document, PopulatedDoc, Schema, Types } from "mongoose";
import { IUser } from "./User";
import { IProduct } from "./Product";

export interface IRestaurant extends Document {
    _id: Types.ObjectId;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    logo: string;
    description: string;
    manager: PopulatedDoc<IUser & Document>;
    products: PopulatedDoc<IProduct & Document>[];
}

const restaurantSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },

    logo: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    manager: {
        type: Types.ObjectId,
        ref: 'User'
    },

    products: [
        {
            type: Types.ObjectId,
            ref: 'Product'
        }
    ]
});

const Restaurant = mongoose.model<IRestaurant>('Restaurant', restaurantSchema);
export default Restaurant