import { RoomService } from "./room-service";
import { Request, Response } from "express";

export class RoomProvider {
    constructor(private service: RoomService) {}

    createRoom = async (req: Request, res: Response) => {
        try {
            const { id } = req.body;
            await this.service.createRoom(id);
            res.status(200).send('Room created');
        }
        catch (e) {
            res.status(500).send(e);
        }
    }

    exists = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const exists = this.service.exists(id);
            res.status(200).send({ result: exists });
        }
        catch (e) {
            res.status(500).send(e);
        }
    }

    getRooms = async (req: Request, res: Response) => {
        try {
            const rooms = this.service.getRooms();
            res.status(200).send(rooms);
        }
        catch (e: any) {
            res.status(500).send(e.message);
        }
    }
}