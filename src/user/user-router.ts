import express from 'express';
import { UserController } from './user-controller';
import UserService from './user-service';

const router = express.Router();

const userService = new UserService();
const userController = new UserController(userService);

router.post('/register', userController.register);
router.post('/login', userController.login);

export default router;