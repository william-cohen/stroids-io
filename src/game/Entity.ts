import * as PIXI from 'pixi.js';
import Vector2 from '../util/Vector2';
import hspline from '../util/HermiteSpline';
import Util from '../util/Util';
import { PlayerStatePacket } from './NetworkPackets';

abstract class Entity {

    public static readonly DEFAULT_LIFESPAN: number = 3;

    protected id: string | number;
    protected pos: Vector2;
    protected vel: Vector2;
    protected lifespan: number;

    constructor(id: string | number) {
        this.lifespan = Entity.DEFAULT_LIFESPAN;
        this.id = id;
        this.pos = new Vector2(0, 0);
        this.vel = new Vector2(0, 0);
    }

    getId() {
        return this.id;
    }

    getX(): number {
        return this.pos.x;
    }

    getY(): number {
        return this.pos.y;
    }

    getVX(): number {
        return this.vel.x;
    }

    getVY(): number {
        return this.vel.y;
    }

    getLifespan(): number {
        return this.lifespan;
    }

    abstract insertInto(camera: Viewport): void;

    abstract removeFrom(camera: Viewport): void;

    abstract updateState(state: any): void;

    abstract update(delta?: number): void;

    abstract draw(): void;

}

export default Entity;
