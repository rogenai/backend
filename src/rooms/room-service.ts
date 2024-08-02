import { Server, Socket } from "socket.io";
import { levelService } from "../level/level-router";
import { Map } from "../level/level-service";
import { v4 as uuidv4 } from 'uuid';
import { io } from "..";

type Entity = {
    x: number;
    y: number;
    entity: string;
    name: string;
    id: string;
}

type Player = {
    name: string;
    id: string;
    socket: Socket;
}

export class Room {
    id: string;
    entities: Entity[] = [];
    players: Player[] = [];

    constructor(id: string, server: Server) {
        this.id = id;

        setInterval(() => {
            this.entities.forEach((entity) => {
                if (entity.entity === 'player') return;
                this.entities.filter((ent) => ent.entity === 'player').forEach((player) => {
                    const mod = Math.sqrt((entity.x - player.x) ** 2 + (entity.y - player.y) ** 2);
                    if (entity.entity === 'ranged_orc') {
                        if (mod <= 200) {
                            let x = (player.x - entity.x) / mod;
                            let y = (player.y - entity.y) / mod;
    
                            server.emit('action', { id: entity.id, x, y });
                        }
                    }
                    else if (entity.entity === 'orc') {
                        if (mod <= 30) {
                            server.emit('action', { id: entity.id });
                        }
                    }
                });
            });
        }, 3000);
    }

    loadLevel(level: Map) {
        const map = level.map;
        const tilesize = 30;
        const offset = 0;

        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                if (map[i][j] === 1) {
                    this.entities.push({
                        x: i * tilesize + offset,
                        y: j * tilesize + offset,
                        entity: 'orc',
                        name: 'Orc',
                        id: uuidv4()
                    });
                }

                if (map[i][j] === 4) {
                    this.entities.push({
                        x: i * tilesize + offset,
                        y: j * tilesize + offset,
                        entity: 'ranged_orc',
                        name: 'RangedOrc',
                        id: uuidv4()
                    });
                }
            }
        }
    }

    handleConnection(socket: Socket, username: string, userId: string) {

        if (this.entities.some((val) => val.id === userId)) {
            console.log('User already in room, reconnecting...');
            this.players = this.players.filter((player) => {
                if (player.id === userId) {
                    player.socket.disconnect();
                    return false;
                }
                return true;
            });

            this.entities = this.entities.filter((ent) => ent.id !== userId);
        }

        socket.join(this.id);

        this.entities.push({
            x: 0,
            y: 0,
            id: userId,
            entity: 'player',
            name: username,
        });

        this.players.push({
            socket: socket,
            id: userId,
            name: username
        });


        socket.emit('init', { entities: this.entities, id: userId });

        socket.broadcast.to(this.id).emit('join', {
            x: 0,
            y: 0,
            id: userId,
            name: username
        });

        socket.on('move', (data: any) => {
            this.entities.forEach((player) => {
                if (player.id === userId) {
                    player.x = data.x;
                    player.y = data.y;
                }
            });

            socket.broadcast.to(this.id).emit('data', this.entities);
        });

        socket.on('attack', () => {
            console.log('Attack', username);
            socket.broadcast.to(this.id).emit('action', { id: userId });
        });

        socket.on('disconnect', () => {
            this.entities = this.entities.filter((val) => val.id !== userId);
            this.players = this.players.filter((val) => val.id !== userId);
            socket.broadcast.to(this.id).emit('leave', { id: userId });
            console.log("Disconnected", username);
        });
    }
}

export class RoomService {

    rooms: Room[] = [];

    createRoom(roomId: string) {
        if (this.rooms.some((room) => room.id === roomId)) return;
        console.log("Creating room", roomId);
        const room = new Room(roomId, io);
        this.rooms.push(room);

        levelService.getLevelById(roomId).then((level) => {
            if (level === null) {
                throw new Error('Level not found');
            }
            room.loadLevel(level);
        });
    }

    deleteRoom(roomId: string) {
        this.rooms = this.rooms.filter((room) => room.id !== roomId);
    }

    getRoom(roomId: string) {
        return this.rooms.find((room) => room.id === roomId);
    }

    exists(roomId: string) {
        return this.rooms.some((room) => room.id === roomId);
    }

    getRooms() {
        return this.rooms.map((room) => ({ id: room.id, entities: room.entities.map((player) => ({ 
            name: player.name, 
            x: player.x, 
            y: player.y, 
            id: player.id
        })) }) );
    }
}