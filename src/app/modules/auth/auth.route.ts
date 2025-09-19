import express from 'express';
import auth from '../../middlewares/auth';
import { AuthController } from './auth.controller';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', auth(), AuthController.getLoggedInUser);

export const AuthRoutes = router;


