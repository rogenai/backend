import "dotenv/config";
import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import gameRouter from "./game/game-router";
import userRouter from "./user/user-router";
import levelRouter from "./level/level-router";
import cors from "cors";
import connectDB from "./db";
import { logger } from "./logger";
import GameServer from "./game_server/server";
import roomRouter from "./rooms/room-router";

connectDB();

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());
app.use(logger);
app.use(gameRouter);
app.use('/user', userRouter);
app.use('/level', levelRouter);
app.use('/room', roomRouter);

export const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

new GameServer(io);

server.listen(process.env.PORT, () => {
  console.log(`server running at port ${process.env.PORT}`);
});