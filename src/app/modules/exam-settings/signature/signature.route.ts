import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { SignatureValidation } from './signature.validation';
import { SignatureController } from './signature.controller';

const router = express.Router();

router.get('/', validateRequest(SignatureValidation.getAllZodSchema), SignatureController.getAll);
router.get('/:id', validateRequest(SignatureValidation.getByIdZodSchema), SignatureController.getById);
router.post('/', validateRequest(SignatureValidation.createZodSchema), SignatureController.create);
router.patch('/:id', validateRequest(SignatureValidation.updateZodSchema), SignatureController.update);
router.delete('/:id', validateRequest(SignatureValidation.idParamZodSchema), SignatureController.remove);

export const SignatureRoutes = router;
