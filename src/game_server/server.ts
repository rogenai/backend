import { Server, Socket } from "socket.io";

class GameServer {

    constructor(socket: Server) {
        socket.on('connection', (socket: Socket) => {
            console.log('a user connected');
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
    }
}