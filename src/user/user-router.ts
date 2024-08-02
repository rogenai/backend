import express from 'express';
import { UserController } from './user-controller';
import UserService from './user-service';

const router = express.Router();

export const userService = new UserService();
export const userController = new UserController(userService);

router.post('/register', userController.register);
router.post('/login', userController.login);

export default router;