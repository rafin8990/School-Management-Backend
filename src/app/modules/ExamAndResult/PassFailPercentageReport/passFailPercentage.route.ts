import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { PassFailPercentageController } from './passFailPercentage.controller';
import { PassFailPercentageValidation } from './passFailPercentage.validation';

const router = express.Router();

router.post('/', validateRequest(PassFailPercentageValidation.generateZodSchema), PassFailPercentageController.generate);

export const PassFailPercentageRoutes = router;



