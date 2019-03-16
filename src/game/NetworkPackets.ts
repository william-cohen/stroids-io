export interface PlayerStatePacket {
    id: string;
    thrust: true;
    alive: true;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
}

export interface AsteroidStatePacket {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
}

export interface GameStatePacket {
    addedPlayers: Array<{id: string, username: string}>;
    asteroids: Array<AsteroidStatePacket>;
    enemies: Array<PlayerStatePacket>;
    leader: string;
    player: PlayerStatePacket;
    removedPlayers: Array<string>;
    score: number;
    timestamp: number;
    updatedAsteroids: Array<AsteroidStatePacket>;
}
