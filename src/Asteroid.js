/* global require, PIXI */
const Vector2 = require('../util/Vector2');

class Asteroid {
    constructor(size) {
        this.pos = new Vector2(0.0, 0.0);
        this.vel = new Vector2(0.0, 0.0);
        this.sprite = null;
        this.radius = 0;
        switch (size) {
        case 1:
            this.sprite = new PIXI.Sprite(PIXI.loader.resources['assets/spritesheet.json'].textures['rock1.png']);
            this.radius = 10;
            break;
        case 2:
            this.sprite = new PIXI.Sprite(PIXI.loader.resources['assets/spritesheet.json'].textures['rock2.png']);
            this.radius = 15;
            break;
        case 3:
            this.sprite = new PIXI.Sprite(PIXI.loader.resources['assets/spritesheet.json'].textures['rock3.png']);
            this.radius = 25;
            break;
        default:
            break;
        }
        this.sprite.anchor.set(0.5);
    }

    setState(state) {
        this.pos.x = state.x;
        this.pos.y = state.y;
        this.vel.x = state.vx;
        this.vel.y = state.vy;
    }

    update(delta) {
        this.pos.x += this.vel.x*delta;
        this.pos.y += this.vel.y*delta;
    }

    draw() {
        this.sprite.x = this.pos.x;
        this.sprite.y = this.pos.y;
    }
}

module.exports = Asteroid;
