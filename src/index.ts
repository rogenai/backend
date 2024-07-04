import "dotenv/config";
import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import gameRouter from "./game/game-router";

const app = express();
const server = createServer(app);

app.use(express.static("public"));
app.use(express.json());
app.use(gameRouter);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

server.listen(3000, () => {
  console.log(`server running at http://localhost:3000`);
});