// basic room router

import express from 'express';
import { RoomService } from './room-service';
import { RoomProvider } from './room-provider';

const router = express.Router();

export const roomService = new RoomService();
export const roomProvider = new RoomProvider(roomService);

router.get('/', roomProvider.getRooms);
router.post('/create', roomProvider.createRoom);
router.get('/exists/:id', roomProvider.exists);
router.get('/:id', roomProvider.getRoom);

export default router;