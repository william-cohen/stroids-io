/* global Image */
const Vector2 = require('./Vector2');

class Enemy {
    constructor(id, username) {
        this.id = id;
        this.username = username;
        this.pos = new Vector2(0.0, 0.0);
        this.vel = new Vector2(0.0, 0.0);
        this.sprite = new Image();
        this.sprite.src = 'img/player.png';
        this.spriteT = new Image();
        this.spriteT.src = 'img/playerT.png';
        this.spriteT2 = new Image();
        this.spriteT2.src = 'img/playerT2.png';
        this.rotation = 0.0;
        this.tick = 0;
        this.thrust = false;
        this.alive = true;
    }

    setState(state) {
        this.pos.x = state.x;
        this.pos.y = state.y;
        this.vel.x = state.vx;
        this.vel.y = state.vy;
        this.rotation = state.rotation;
        this.thrust = state.thrust;
        this.alive = state.alive;
    }

    update() {
        if (!this.alive) return;

        this.tick++;
        this.tick %= 6;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }

    draw(ctx) {
        if (!this.alive) return;
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rotation + Math.PI/2);
        ctx.translate(-this.pos.x, -this.pos.y);
        if (this.thrust) {
            if (this.tick > 2) {
                ctx.drawImage(this.spriteT, this.pos.x - 19, this.pos.y - 24);
            } else {
                ctx.drawImage(this.spriteT2, this.pos.x - 19, this.pos.y - 24);
            }
        } else {
            ctx.drawImage(this.sprite, this.pos.x - 19, this.pos.y - 24);
        }
        ctx.restore();
        ctx.font = '12px serif';
        ctx.fillStyle = 'white';
        ctx.fillText(this.username, this.pos.x - 25, this.pos.y + 45);
    }
}

module.exports = Enemy;
