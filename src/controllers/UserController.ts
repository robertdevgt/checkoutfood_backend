import { Request, Response } from "express";

export class UserController {
    static async addAddress(req: Request, res: Response) {
        try {
            req.user.addresses.push(req.body);

            await req.user.save();

            res.send('Dirección generada correctamente');
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    static async deleteAddress(req: Request, res: Response) {
        try {
            const { addressId } = req.params;

            req.user.addresses = req.user.addresses.filter((address) => address.id.toString() != addressId);

            await req.user.save();

            res.send('Dirección Eliminada correctamente');
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    static async getAddresses(req: Request, res: Response) {
        try {
            res.json(req.user.addresses);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}