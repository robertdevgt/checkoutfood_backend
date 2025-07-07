import { Response, Request } from "express";
import sharp from 'sharp';
import path from "path";
import Restaurant from "../models/Restaurant";
import { getDistanceInKm } from "../utils/distance";
import Product from "../models/Product";

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

    static async getNerbyResturants(req: Request, res: Response) {
        try {
            const { latitude, longitude } = req.params;

            const filteredRestaurants = [];

            const restaurants = await Restaurant.find({}, '_id name address latitude longitude logo');

            restaurants.map(restaurant => {
                const distance = getDistanceInKm(+latitude, +longitude, restaurant.latitude, restaurant.longitude);
                if (distance < 10) {
                    filteredRestaurants.push({
                        ...restaurant.toObject(),
                        distance: distance
                    });
                }
            });

            res.json(filteredRestaurants);

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static async addProduct(req: Request, res: Response) {
        try {
            const product = new Product(req.body);
            product.restaurant = req.restaurant.id;

            const filename = `${product.id}.png`;
            const outputPath = path.join(__dirname, '..', 'uploads', filename);
            await sharp(req.file.buffer).resize(300, 300, { fit: 'cover', position: 'center' }).png().toFile(outputPath);

            product.img = filename;

            req.restaurant.products.push(product.id);

            await Promise.allSettled([req.restaurant.save(), product.save()]);

            res.send('Producto Agregado Correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async changeProductStatus(req: Request, res: Response) {
        try {
            const { productId } = req.params;

            const product = await Product.findById(productId);

            if (!product) {
                res.status(404).send('Producto no encontrado');
                return;
            }

            product.status = !product.status;

            await product.save();

            res.send('Producto Actualizado');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getRestaurantById(req: Request, res: Response) {
        try {
            const restaurant = await Restaurant.findById(req.restaurant.id).select('_id name address latitude longitude description logo manager').populate('products');

            res.json(restaurant);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

