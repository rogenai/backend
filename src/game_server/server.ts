import { Server, Socket } from "socket.io";
import { userService } from "../user/user-router";
import User from "../user/models/User";
import { roomService } from "../rooms/room-router";


class GameServer {

    constructor(server: Server) {

        server.on('connection', async (socket: Socket) => {
            const data = socket.handshake.query! as any;

            if (!data.token || !data.roomId) {
                console.log("Invalid connection", data);
                socket.disconnect();
                return;
            }

            const payload = userService.verifyJwt(data.token);
            
            if (!payload) {
                console.log('Invalid token', data);
                socket.disconnect();
                return;
            }

            const user = (await User.findById(payload.id))!;

            console.log('User connected', user.username);

            const room = roomService.getRoom(data.roomId);

            if (!room) {
                console.log("Room not found", data.roomId);
                socket.disconnect();
                return;
            }

            room.handleConnection(socket, user.username, user.id);
        });
    }
}

export default GameServer;