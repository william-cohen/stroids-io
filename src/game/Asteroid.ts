import * as PIXI from 'pixi.js';
import Vector2 from '../util/Vector2';
import Entity from './Entity';
import lerp from '../util/LinearInterpolation';

class Asteroid extends Entity {
    private sprite: PIXI.Sprite;
    private radius: number;
    private oldPos: Vector2;
    private oldVel: Vector2;
    private lerp_t: number;
    constructor(id: number) {
        super(id);
        this.pos = new Vector2(0.0, 0.0);
        this.vel = new Vector2(0.0, 0.0);
        this.oldPos = new Vector2(0.0, 0.0);
        this.oldVel = new Vector2(0.0, 0.0);
        this.lerp_t = 0;

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

    updateState(state: { x: any; y: any; vx: any; vy: any; }, delta: number) {
        this.lifespan = Entity.DEFAULT_LIFESPAN;

        this.oldPos = this.pos.clone();
        this.oldVel = this.vel.clone();
        this.lerp_t = 0;
        
        this.pos.x = state.x; + (state.vx * delta);
        this.pos.y = state.y; + (state.vy * delta);
        this.vel.x = state.vx;
        this.vel.y = state.vy;
    }

    update(delta: number) {
        this.lifespan -= delta;
        //this.pos.x += this.vel.x*delta;
        //this.pos.y += this.vel.y*delta;
    }

    draw() {
        this.lerp_t += 1.0/6.0;

        let p = lerp(this.oldPos, this.pos, this.lerp_t);

        if (p.subtract(this.oldPos).mag2() < 250) {
            this.sprite.x = p.x;
            this.sprite.y = p.y;
        } else {
            this.sprite.x = this.pos.x;
            this.sprite.y = this.pos.y;
        }
    }
}

export default Asteroid;
