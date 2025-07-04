import { Schema } from "mongoose";

export interface IAddress {
    id: string;
    label: string,
    formatted_address: string,
    street: string,
    number: string,
    zone: string,
    city: string,
    department: string,
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
        street: {
            type: String,
            required: false
        },
        number: {
            type: String,
            required: false
        },
        zone: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
        },
        department: {
            type: String,
            required: false
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
