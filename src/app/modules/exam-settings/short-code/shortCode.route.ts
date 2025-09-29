import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { ShortCodeValidation } from './shortCode.validation';
import { ShortCodeController } from './shortCode.controller';

const router = express.Router();

router.get('/', validateRequest(ShortCodeValidation.getAllZodSchema), ShortCodeController.getAll);
router.post('/', validateRequest(ShortCodeValidation.createZodSchema), ShortCodeController.create);
router.patch('/:id', validateRequest(ShortCodeValidation.updateZodSchema), ShortCodeController.update);
router.delete('/:id', ShortCodeController.remove);

export const ShortCodeRoutes = router;


