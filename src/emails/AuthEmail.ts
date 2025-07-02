import { transporter } from "../config/email"

interface IEmail {
    name: string;
    email: string;
    token: string;
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: 'CheckoutFood <admin@uptask.com>',
            to: user.email,
            subject: 'CheckoutFood - Confirma tu cuenta',
            text: 'CheckoutFood - Confirma tu cuenta',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <div style="background-color: #007BFF; padding: 16px 24px;">
                        <h2 style="color: white; margin: 0;">CheckoutFood</h2>
                    </div>
                    <div style="padding: 24px;">
                        <p style="font-size: 16px;">Hola <strong>${user.name}</strong>,</p>
                        <p style="font-size: 16px;">Gracias por registrarte en <strong>CheckoutFood</strong>. Para completar el proceso, confirma tu cuenta haciendo clic en el siguiente botón:</p>
                        <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL}/confirm-account" style="background-color: #28a745; color: white; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-size: 16px; display: inline-block;">Confirmar cuenta</a>
                        </div>
                        <p style="font-size: 16px;">E ingresa el codigo:</p>
                        <p style="font-size: 20px; font-weight: bold; color: #007BFF;">${user.token}</p>
                        <p style="font-size: 14px; color: #666;">Este código expira en 10 minutos.</p>
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
                        <p style="font-size: 12px; color: #999; text-align: center;">Si no solicitaste esta cuenta, puedes ignorar este correo.</p>
                    </div>
                    </div>
                </div>
                `
        })

        console.log('Mensaje enviado', info.messageId)
    }
}