import * as PIXI from 'pixi.js';
import Vector2 from '../util/Vector2';
import Entity from './Entity';

class Asteroid extends Entity {
    private sprite: PIXI.Sprite;
    private radius: number;
    constructor(id: number) {
        super(id);
        this.pos = new Vector2(0.0, 0.0);
        this.vel = new Vector2(0.0, 0.0);
        this.radius = 10;
        this.sprite = new PIXI.Sprite(PIXI.loader.resources['assets/spritesheet.json'].textures!['rock1.png']); 
        let size = id%3 + 1;
        switch (size) {
        case 2:
            this.sprite = new PIXI.Sprite(PIXI.loader.resources['assets/spritesheet.json'].textures!['rock2.png']);
            this.radius = 15;
            break;
        case 3:
            this.sprite = new PIXI.Sprite(PIXI.loader.resources['assets/spritesheet.json'].textures!['rock3.png']);
            this.radius = 25;
            break;
        default:
            break;
        }
        this.sprite.anchor.set(0.5);
    }

    insertInto(camera: Viewport) {
        camera.addChild(this.getSprite());
    }

    removeFrom(camera: Viewport) {
        camera.removeChild(this.getSprite());
    }

    getSprite(): PIXI.Sprite {
        return this.sprite;
    }

    updateState(state: { x: any; y: any; vx: any; vy: any; }) {
        this.lifespan = Entity.DEFAULT_LIFESPAN;
        this.pos.x = state.x;
        this.pos.y = state.y;
        this.vel.x = state.vx;
        this.vel.y = state.vy;
    }

    update(delta: number) {
        this.lifespan -= delta;
        this.pos.x += this.vel.x*delta;
        this.pos.y += this.vel.y*delta;
    }

    draw() {
        this.sprite.x = this.pos.x;
        this.sprite.y = this.pos.y;
    }
}

export default Asteroid;
