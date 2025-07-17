import { Router } from "express";
import { OrderController } from "../controllers/OrderController";
import { authenticate } from "../middleware/auth";
import { handleInputErrors } from "../middleware/validation";
import { body } from "express-validator";
import { restaurantExists } from "../middleware/restaurant";


const router = Router();

router.use(authenticate);
router.param('restaurantId', restaurantExists);

router.post('/:restaurantId/:addressId',
    body('items').notEmpty().withMessage('La orden no puede ir vacía'),
    body('notes'),
    handleInputErrors,
    OrderController.crateOrder
);

export default router;