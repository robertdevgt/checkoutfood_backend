import mongoose, { Schema, Document } from "mongoose"
import { addressSchema, IAddress } from "./Address"

export interface IUser extends Document {
    email: string
    password: string
    name: string
    confirmed: boolean
    phone: string;
    role: string;
    addresses: IAddress[];
}

const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    addresses: [addressSchema]
})

const User = mongoose.model<IUser>('User', userSchema)
export default User