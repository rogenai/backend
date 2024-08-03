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
    velx: number;
    vely: number;
    health: number;
}

type Player = {
    name: string;
    id: string;
    socket: Socket;
}

type Platform = {
    x: number;
    y: number;
}

type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
}

function doOverlap(rectA: Rect, rectB: Rect): boolean {
    return Math.abs(rectA.x - rectB.x) < (Math.abs(rectA.width + rectB.width) / 2) 
        && (Math.abs(rectA.y - rectB.y) < (Math.abs(rectA.height + rectB.height) / 2))
}

const TILESIZE = 30;
const entityWidth = 20;
const entityHeight = 10;

export class Room {
    id: string;
    entities: Entity[] = [];
    players: Player[] = [];
    platforms: Platform[] = [];
    spawnX: number = 0;
    spawnY: number = 0;

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
    
                            server.to(this.id).emit('action', { id: entity.id, x, y });
                        }
                    }
                    else if (entity.entity === 'orc') {
                        if (mod <= 30) {
                            server.to(this.id).emit('action', { id: entity.id });
                        }
                    }
                });
            });
        }, 2000);

        setInterval(() => {
            this.entities.forEach((entity) => {
                if (entity.entity === 'player') return;

                const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
                const choice = dirs[Math.floor(Math.random() * dirs.length)];
                const deltaX = choice[0] * TILESIZE;
                const deltaY = choice[1] * TILESIZE;

                if (this.platforms.some((platform) => {
                    return Math.abs(entity.x + deltaX - platform.x) < TILESIZE / 2 &&
                        Math.abs(entity.y + deltaY - platform.y) < TILESIZE / 2;
                })) return;

                entity.x = entity.x + deltaX;
                entity.y = entity.y + deltaY;
            });
            server.emit('data', this.entities);
        }, 2000);
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
                        velx: 0,
                        vely: 0,
                        entity: 'orc',
                        name: 'Orc',
                        health: 100,
                        id: uuidv4()
                    });
                }

                if (map[i][j] === 3) {
                    this.spawnX = i * tilesize + offset;
                    this.spawnY = j * tilesize + offset;
                }
                
                if (map[i][j] === 4) {
                    this.entities.push({
                        x: i * tilesize + offset,
                        y: j * tilesize + offset,
                        velx: 0,
                        vely: 0,
                        entity: 'ranged_orc',
                        name: 'RangedOrc',
                        health: 100,
                        id: uuidv4()
                    });
                }

                if (map[i][j] === 2) {
                    this.platforms.push({
                        x: i * tilesize + offset,
                        y: j * tilesize + offset
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
            velx: 0,
            vely: 0,
            id: userId,
            entity: 'player',
            health: 100,
            name: username,
        });

        this.players.push({
            socket: socket,
            id: userId,
            name: username
        });


        socket.emit('init', { 
            entities: this.entities, 
            id: userId, platforms: 
            this.platforms,
            spawnX: this.spawnX,
            spawnY: this.spawnY
        });

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

        socket.on('damage', (data) => {
            const ent = this.entities.find((ent) => ent.id === data.id);
            if (!ent) {
                console.log("Entity not found", data);
                return;
            }
            ent.health -= data.damage;
            socket.to(this.id).emit('data', this.entities);
            socket.emit('data', this.entities);
            if (ent.health <= 0) {
                this.entities = this.entities.filter((val) => val.id !== ent.id);
            }
        });

        socket.on('damage-got', (damage) => {
            const ent = this.entities.find((ent) => ent.id === userId);
            if (!ent) {
                console.log("Player not found", userId);
                return;
            }
            ent.health -= damage;
            socket.to(this.id).emit('data', this.entities);
            socket.emit('data', this.entities);
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

    createRoom(levelId: string) {
        console.log("Creating room", levelId);
        const roomId = uuidv4();
        const room = new Room(roomId, io);
        this.rooms.push(room);

        levelService.getLevelById(levelId).then((level) => {
            if (level === null) {
                throw new Error('Level not found');
            }
            room.loadLevel(level);
        });

        return { id: roomId };
    }

    deleteRoom(roomId: string) {
        this.rooms = this.rooms.filter((room) => room.id !== roomId);
    }

    getRoomData(roomId: string) {
        const { id, players } = this.rooms.find((room) => room.id === roomId)!;
        return { id, players: players.map((player) => ({ id: player.id, name: player.name }) ) };
    }

    getRoom(roomId: string) {
        return this.rooms.find((room) => room.id === roomId);
    }

    exists(roomId: string) {
        return this.rooms.some((room) => room.id === roomId);
    }

    getRooms() {
        return this.rooms.map((room) => ({ 
            id: room.id, 
            players: room.players.map((player) => ({ id: player.id, name: player.name }) ) 
        }) );
    }
}