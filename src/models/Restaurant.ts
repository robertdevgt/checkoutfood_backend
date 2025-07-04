import mongoose, { Document, PopulatedDoc, Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface IRestaurant extends Document {
    _id: Types.ObjectId;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    logo: string;
    manager: PopulatedDoc<IUser & Document>;
    description: string;
}

const restaurantSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
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
});

const Restaurant = mongoose.model<IRestaurant>('Restaurant', restaurantSchema);
export default Restaurant