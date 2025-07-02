import { Request, Response } from "express"
import { hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import User from "../models/User";
import Token from "../models/Token";

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const userExists = await User.findOne({ email });

            if (userExists) {
                res.status(409).json({ error: 'El usuario ya existe' });
                return;
            }

            const user = new User(req.body);
            user.password = await hashPassword(password);

            const token = new Token;
            token.user = user.id;
            token.token = generateToken();


            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: token.token
            });

            await Promise.allSettled([user.save(),token.save()]);
            res.send('Revisa tu email, hemos enviado instrucciones para completar con el registro');
        } catch (error) {
            res.status(400).json({ error: 'Hubo un error' });
        }
    }
}