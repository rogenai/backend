import { exampleMap } from '../ai/levels';
import openaiservice from '../ai/openai';
import LevelSchema, { ILevel } from './models/Level';

enum Entities {
  ORC = 1,
  WALL = 2,
  PLAYER = 3,
  RANGED = 2,
}

function convertType(type: number) {
  switch (type) {
    case 1:
      return "ORC";
    case 2:
      return "WALL";
    case 3:
      return "PLAYER";
    case 4:
      return "RANGED";
  }
}

function convertTypeString(type: string) {
  switch (type) {
    case "ORC":
      return 1;
    case "WALL":
      return 2;
    case "PLAYER":
      return 3;
    case "RANGED":
      return 4;
  }
}

type Map = {
  map: number[][];
  id: string;
  difficulty: string;
  name: string;
}

function convertData(data: ILevel): Map {
  const map = Array(20).fill(0).map(() => Array(20).fill(0));

  for (const entity of data.entities) {
    map[entity.x][entity.y] = convertTypeString(entity.type);
  }

  return { map: map, id: data._id as string, difficulty: data.difficulty, name: data.name };
}

export class LevelService {

  constructor() {}

  async getTutorialLevel() {
    return exampleMap;
  }

  async generateLocation(difficulty: string) {
    const map = await openaiservice.generateLocation(difficulty);
    const array = map.map;
    const entities = [];

    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        if (array[i][j] !== 0) {
          entities.push({
            x: i,
            y: j,
            type: convertType(array[i][j])
          });
        }
      }
    }

    return await new LevelSchema({
      name: "level",
      difficulty: difficulty,
      entities: entities
    }).save();
  }

  async getLevelById(id: string) {
    const level = await LevelSchema.findById(id).exec();
    if (level !== null) {
      return convertData(level);
    }
    return null;
  }

  async getAllLevels() {
    const levels = await LevelSchema.find().exec();
    return levels.map((level) => convertData(level));
  }
}