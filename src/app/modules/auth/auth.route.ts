import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post('/register', validateRequest(AuthValidation.registerZodSchema), AuthController.register);
router.post('/login', validateRequest(AuthValidation.loginZodSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', auth(), AuthController.getLoggedInUser);

export const AuthRoutes = router;


