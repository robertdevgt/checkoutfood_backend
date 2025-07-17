import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { RestaurantController } from "../controllers/RestaurantController";
import { handleInputErrors } from "../middleware/validation";
import { body, param } from "express-validator";
import { imageExists } from "../middleware/img";
import { restaurantExists } from "../middleware/restaurant";
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });


const router = Router();

router.get('/nerby/:latitude/:longitude',
    RestaurantController.getNerbyResturants
)

router.get('/:restaurantId',
    handleInputErrors,
    RestaurantController.getRestaurantById
)


router.get('/products/:restaurantId',
    handleInputErrors,
    RestaurantController.getAllRestaurantProducts
)


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



router.param('restaurantId', restaurantExists);

router.post('/add-product/:restaurantId',
    upload.single('img'),
    body('price').notEmpty().withMessage('El precio es requerido').isNumeric().withMessage('El precio debe de ser un número'),
    body('name').notEmpty().withMessage('El nombre del producto es requerido'),
    body('category').notEmpty().withMessage('La categoria es requerida'),
    body('description').notEmpty().withMessage('La descripción es requerida'),
    handleInputErrors,
    imageExists,
    RestaurantController.addProduct
)

router.patch('/updateproduct-status/:productId',
    param('productId').isMongoId().withMessage('El id no es válido'),
    handleInputErrors,
    RestaurantController.changeProductStatus
)



export default router;