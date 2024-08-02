
import express from 'express';
import { LevelController } from './level-controller';
import { LevelService } from './level-service';

const router = express.Router();
export const levelService = new LevelService();
export const levelController = new LevelController(levelService);

router.post("/generate", levelController.generateLevel);
router.get("/all", levelController.getAllLevels);
router.get('/tutorial', levelController.getTutorialLevel);
router.get("/:id", levelController.getLevelById);

export default router;