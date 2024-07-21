import express from 'express';
import { GameController } from './game-controller';

const router = express.Router();
const gameController = new GameController();

export default router;