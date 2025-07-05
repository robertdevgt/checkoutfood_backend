import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { RestaurantController } from "../controllers/RestaurantController";
import { handleInputErrors } from "../middleware/validation";
import { body } from "express-validator";
import { imageExists } from "../middleware/img";
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });


const router = Router();

router.use(authenticate);

router.post('/',
    upload.single('img'),
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('address').notEmpty().withMessage('La dirección es requerida'),
    body('latitude').notEmpty().withMessage('La latitud es requerida').isFloat().withMessage('Debe de ser un número'),
    body('longitude').notEmpty().withMessage('La longitud es requerida').isFloat().withMessage('Debe de ser un número'),
    body('description').notEmpty().withMessage('La descripción es requerida'),
    imageExists,
    handleInputErrors,
    RestaurantController.createRestaurant
);

router.get('/',
    RestaurantController.getRestaurants
);

router.get('/nerby/:latitude/:longitude',
    RestaurantController.getNerbyResturants
)

export default router;