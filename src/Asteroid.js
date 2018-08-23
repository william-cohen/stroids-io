/* global Image */
const Vector2 = require('./Vector2');

class Asteroid {
    constructor(size) {
        this.pos = new Vector2(0.0, 0.0);
        this.vel = new Vector2(0.0, 0.0);
        this.sprite = new Image();
        this.sprite.src = '';
        this.radius = 0;
        switch (size) {
        case 1:
            this.sprite.src = 'img/rock1.png';
            this.radius = 10;
            break;
        case 2:
            this.sprite.src = 'img/rock2.png';
            this.radius = 15;
            break;
        case 3:
            this.sprite.src = 'img/rock3.png';
            this.radius = 25;
            break;
        default:
            break;
        }
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

    draw(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rotation + Math.PI/2);
        ctx.translate(-this.pos.x, -this.pos.y);
        ctx.drawImage(this.sprite, this.pos.x - this.radius, this.pos.y - this.radius);
        ctx.restore();
    }
}

module.exports = Asteroid;
