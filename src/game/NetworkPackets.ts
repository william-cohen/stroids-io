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
    enemies: Array<PlayerStatePacket>;
    leader: string;
    player: PlayerStatePacket;
    score: number;
    timestamp: number;
    asteroids: Array<AsteroidStatePacket>;
}

export interface InitialStatePakcet {
    player: PlayerStatePacket;
    enemies: Array<AddedPlayerPacket>;
    asteroids: Array<AsteroidStatePacket>;
}

export interface AddedPlayerPacket {
    id: string;
    username: string;
}