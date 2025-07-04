import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";
import { body } from "express-validator";
import { requestTokenCount } from "../middleware/requests-token";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post('/create-account',
    body('name').notEmpty().withMessage('El nombre no puede ir vacio'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña es muy corto, minimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no son iguales')
        }
        return true
    }),
    body('phone').notEmpty().withMessage('El número de telefono es requerido'),
    body('email').isEmail().withMessage('E-mail no válido'),
    body('role').notEmpty().withMessage('El rol es requerido'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token').notEmpty().withMessage('El token es requerido'),
    handleInputErrors,
    AuthController.confirmAccount
)
router.post('/request-token',
    body('email').notEmpty().withMessage('El email es requerido'),
    requestTokenCount,
    handleInputErrors,
    AuthController.requestToken
);

router.post('/login',
    body('email').notEmpty().withMessage('El email es requerido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
    handleInputErrors,
    AuthController.login
);

router.post('/forgot-password',
    body('email').notEmpty().withMessage('El email es requerido'),
    requestTokenCount,
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token').notEmpty().withMessage('El token es requerido'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/update-password/:token',
    body('password').isLength({ min: 8 }).withMessage('La contraseña es muy corto, minimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no son iguales')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updatePassword
)

router.get('/user',
    authenticate,
    handleInputErrors,
    AuthController.user
)

export default router;