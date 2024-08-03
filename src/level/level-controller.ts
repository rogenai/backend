import { CreateLevelDto } from './dto/CreateLevel.dto';
import { LevelService } from './level-service';
import { Request, Response } from 'express';

export class LevelController {
  private levelService: LevelService;

  constructor(levelService: LevelService) {
    this.levelService = levelService;
  }

  generateLevel = async (req: Request, res: Response) => {
    try {
      const body: CreateLevelDto = req.body;
      const level = await this.levelService.generateLocation(body.difficulty, body.name);
      res.status(200).json(level);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getLevelById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const level = await this.levelService.getLevelById(id);
      res.status(200).json(level);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getAllLevels = async (req: Request, res: Response) => {
    try {
      const levels = await this.levelService.getAllLevels();
      res.status(200).json(levels);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getTutorialLevel = async (req: Request, res: Response) => {
    try {
      const level = await this.levelService.getTutorialLevel();
      res.status(200).json(level);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}