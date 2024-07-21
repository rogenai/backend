import { CreateUserDto } from "./dtos/CreateUser.dto";
import User from "./models/User";
import UserService from "./user-service";
import { Request, Response } from "express";

export class UserController {
    private service: UserService;

    constructor(service: UserService) {
        this.service = service;
    }
    
    register = async (req: Request, res: Response) => {
        try {
            const user: CreateUserDto = req.body;
            await this.service.registerUser(user);
            res.status(200).json({ success: true });
        } catch (err: any) {
            res.status(400).json({ success: false, message: err.message });
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const user = await this.service.loginUser(email, password);
            return res.status(200).json(user);
        } catch (err: any) {
            return res.status(400).json({ message: err.message });
        }
    }
}