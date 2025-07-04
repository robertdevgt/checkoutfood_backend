import { Router } from "express";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
import { UserController } from "../controllers/UserController";
import { body, param } from "express-validator";

const router = Router();

router.use(authenticate);

router.post('/add-address',
    body('label').notEmpty().withMessage('El nombre de la dirección es requerida'),
    body('formatted_address').notEmpty().withMessage('La dirección es necesaria'),
    body('latitude').notEmpty().withMessage('La latitud es necesaria'),
    body('longitude').notEmpty().withMessage('La longitud es necesaria'),
    handleInputErrors,
    UserController.addAddress
);

router.delete('/delete-address/:addressId',
    param('addressId').isMongoId().withMessage('El id no es válido'),
    handleInputErrors,
    UserController.deleteAddress
);

router.get('/addresses',
    UserController.getAddresses
)

export default router;