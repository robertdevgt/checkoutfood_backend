import { Request, Response } from "express";
import { orderItemsSchema } from "../schemas/schemas";
import Product from "../models/Product";
import { OrderItem } from "../models/OrderItem";
import Order from "../models/Order";

export class OrderController {
    static async crateOrder(req: Request, res: Response) {
        try {
            const { addressId } = req.params;
            const parsed = orderItemsSchema.safeParse(req.body);

            if (parsed.success) {
                const order = new Order;
                const address = req.user.addresses.filter(address => address.id.toString() === addressId.toString());

                if (address.length === 0) {
                    res.status(404).send('Dirección no encontrada');
                    return;
                }

                let total = 0;

                order.user = req.user.id;
                order.restaurant = req.restaurant.id;
                order.latitude = address[0].latitude;
                order.longitude = address[0].longitude;
                order.formatted_address = address[0].formatted_address;
                order.notes = parsed.data.notes ?? '';


                for (const item of parsed.data.items) {
                    const { product_id, quantity } = item;
                    const product = await Product.findById(product_id);

                    const orderItem = await OrderItem.create({
                        product: product.id,
                        quantity: quantity,
                        subtotal: product.price * quantity,
                        order: order.id
                    });

                    total += product.price * quantity;
                    order.items.push(orderItem.id);
                }

                order.total = total;

                await order.save();
            } else {
                res.status(409).json({ error: 'Información no válida' });
            }
            res.send('Su pedido esta en camino');
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}