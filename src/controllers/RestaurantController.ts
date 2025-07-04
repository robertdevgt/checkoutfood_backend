import { Response, Request } from "express";
import sharp from 'sharp';
import path from "path";
import Restaurant from "../models/Restaurant";

export class RestaurantController {
    static async createRestaurant(req: Request, res: Response) {
        try {
            const restaurant = new Restaurant(req.body);
            const filename = `${restaurant.id}.png`;
            const outputPath = path.join(__dirname, '..', 'uploads', filename);
            await sharp(req.file.buffer).resize(300, 300, { fit: 'cover', position: 'center' }).png().toFile(outputPath);

            restaurant.logo = filename;
            restaurant.manager = req.user.id;

            await restaurant.save();

            res.send('Restaurante Creado Correctamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static async getRestaurants(req: Request, res: Response) {
        try {
            const restaurants = await Restaurant.find({ manager: req.user.id });

            res.send(restaurants);
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }
}