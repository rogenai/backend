import express from 'express';
import { GameController } from './game-controller';

const router = express.Router();
const gameController = new GameController();

router.post("/weapon", gameController.generateWeapon);
router.post("/level", gameController.generateLevel);

export default router;