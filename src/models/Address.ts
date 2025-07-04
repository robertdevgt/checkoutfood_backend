import { Schema } from "mongoose";

export interface IAddress {
    id: string;
    label: string,
    formatted_address: string,
    latitude: number,
    longitude: number,
    notes: string
}

export const addressSchema = new Schema<IAddress>(
    {
        label: {
            type: String,
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
        }
    }
);
