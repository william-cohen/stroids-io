/* global Image */
const Vector2f = require('./Vector2f');

class Enemy {
    constructor(id, username) {
        this.id = id;
        this.username = username;
        this.pos = new Vector2f(0.0, 0.0);
        this.vel = new Vector2f(0.0, 0.0);
        this.sprite = new Image();
        this.sprite.src = 'img/player.png';
        this.spriteT = new Image();
        this.spriteT.src = 'img/playerT.png';
        this.spriteT2 = new Image();
        this.spriteT2.src = 'img/playerT2.png';
        this.rotation = 0.0;
        this.alive = true;
    }

    setState(state) {
        this.pos.x = state.x;
        this.pos.y = state.y;
        this.vel.x = state.vx;
        this.vel.y = state.vy;
        this.rotation = state.rotation;
        this.alive = state.alive;
    }

    update() {
        if (!this.alive) return;

        this.tick++;
        if (this.tick > 5) this.tick -= 5;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }

    draw(ctx) {
        if (!this.alive) return;
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rotation + Math.PI/2);
        ctx.translate(-this.pos.x, -this.pos.y);

        //FIXME Thrust parameter
        ctx.drawImage(this.spriteT, this.pos.x - 19, this.pos.y - 24);

        ctx.restore();
        ctx.font = '12px serif';
        ctx.fillStyle = 'white';
        ctx.fillText(this.username, this.pos.x - 25, this.pos.y + 45);
    }
}

module.exports = Enemy;
