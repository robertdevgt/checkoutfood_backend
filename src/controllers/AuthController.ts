import { Request, Response } from "express";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";
import User from "../models/User";
import Token from "../models/Token";

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { email, password, phone } = req.body;
            const userExists = await User.findOne({ email });

            if (userExists) {
                res.status(409).json({ error: 'El usuario ya existe' });
                return;
            }

            const user = new User(req.body);
            user.password = await hashPassword(password);
            user.phone = phone;

            const token = new Token;
            token.user = user.id;
            token.token = generateToken();


            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: token.token
            });

            await Promise.allSettled([user.save(), token.save()]);
            res.send('Revisa tu email, hemos enviado instrucciones para completar con el registro');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                res.status(404).send('Usuario no encontrado');
                return;
            }

            if (!user.confirmed) {
                const token = new Token;
                token.user = user.id;
                token.token = generateToken();


                await AuthEmail.sendConfirmationEmail({
                    name: user.name,
                    email: user.email,
                    token: token.token
                });

                res.status(401).json({ error: 'La cuenta no ha sido confirmada, hemos enviado un email de cofirmación a tu email' });
                return;
            }

            if (checkPassword(password, user.password)) {
                const token = generateJWT(user);
                res.send(token);
            } else {
                res.status(401).json({ error: 'Credenciales incorrectas' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;

            const tokenExists = await Token.findOne({ token });

            if (!tokenExists) {
                res.status(401).json({ error: 'Token no válido' });
                return;
            }

            const user = await User.findById(tokenExists.user);
            user.confirmed = true;

            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

            res.send('Usuario Confirmado Correctamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static requestToken = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                res.status(404).json({ error: 'Usuario no Encontrado' });
                return;
            }

            if (user.confirmed) {
                res.status(400).json({ error: 'El usuario ya esta confirmado' });
                return;
            }

            const token = new Token;
            token.user = user.id;
            token.token = generateToken();


            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: token.token
            });

            await token.save();

            res.send('Revisa tu email, hemos enviado instrucciones para completar con el registro');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                res.status(404).json({ error: 'Usuario no encontrado' });
                return;
            }

            if (!user.confirmed) {
                res.status(404).json({ error: 'Usuario no Confirmado' });
                return;
            }

            const token = new Token;
            token.user = user.id;
            token.token = generateToken();

            await AuthEmail.sendForgotPasswordEmail({
                name: user.name,
                email: user.email,
                token: token.token
            });

            await token.save();

            res.send('Revisa tu email, hemos enviado instrucciones para completar con el proceso');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;

            const tokenExists = await Token.findOne({ token });

            if (!tokenExists) {
                res.status(401).json({ error: 'Token no válido' });
                return;
            }

            res.send('Token válido');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static updatePassword = async (req: Request, res: Response) => {
        try {
            const { token } = req.params;
            const { password } = req.body;

            const tokenExists = await Token.findOne({ token });

            if (!tokenExists) {
                res.status(401).json({ error: 'Token no válido' });
                return;
            }

            const user = await User.findById(tokenExists.user);

            user.password = await hashPassword(password);

            await Promise.allSettled([tokenExists.deleteOne(), user.save()]);

            res.send('Contraseña actualizada correctamente');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}