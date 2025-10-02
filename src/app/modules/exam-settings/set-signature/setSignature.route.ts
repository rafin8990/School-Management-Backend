import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { SetSignatureValidation } from './setSignature.validation';
import { SetSignatureController } from './setSignature.controller';

const router = express.Router();

router.get('/', validateRequest(SetSignatureValidation.listByReportZodSchema), SetSignatureController.listByReport);
router.post('/bulk', validateRequest(SetSignatureValidation.upsertManyZodSchema), SetSignatureController.upsertMany);

export const SetSignatureRoutes = router;


