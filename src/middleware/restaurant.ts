import { Request, Response, NextFunction } from "express";
import Restaurant, { IRestaurant } from "../models/Restaurant";
import mongoose from "mongoose";

declare global {
    namespace Express {
        interface Request {
            restaurant: IRestaurant
        }
    }
}

export async function restaurantExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { restaurantId } = req.params

        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            res.status(400).json({ error: 'ID de restaurante inválido' });
            return;
        }

        const restaurant = await Restaurant.findById(restaurantId)
        if (!restaurant) {
            const error = new Error('Restaurante no encontrado')
            res.status(404).json({ error: error.message })
            return;
        }
        req.restaurant = restaurant
        next()
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}