/* global Image */

const KeyListener = require('./KeyListener');
const Vector2f = require('./Vector2f');

class Player {
    constructor(socket) {
        this.tick = 0;
        this.socket = socket;
        this.id = 'null';

        this.alive = true;
        this.pos = new Vector2f(0.0, 0.0);
        this.vel = new Vector2f(0.0, 0.0);

        this.rotation = 0.0;
        this.keys = new KeyListener();
        this.sprite = new Image();
        this.sprite.src = 'img/player.png';
        this.spriteT = new Image();
        this.spriteT.src = 'img/playerT.png';
        this.spriteT2 = new Image();
        this.spriteT2.src = 'img/playerT2.png';
    }

    setState(state) {
        this.id = state.id;
        this.pos.x = state.x;
        this.pos.y = state.y;
        this.vel.x = state.vx;
        this.vel.y = state.vy;
        this.rotation = state.rotation;
        this.alive = state.alive;
    }

    update() {
        let input = {
            'W' : false,
            'A' : false,
            'S' : false,
            'D' : false
        };
        this.tick++; this.tick %= 30;
        if (this.alive) {
            this.thrust = false;

            this.tick++;
            this.tick %= 30;

            //Left Arrow Key
            if (this.keys.isPressed(37)) {
                input.A = true;
            }
            //Right Arrow Key
            if (this.keys.isPressed(39)) {
                input.D = true;
            }
            //Up Arrow Key
            if (this.keys.isPressed(38) || this.keys.isPressed(32)) {
                input.W = true;
                this.thrust = true;
                this.vel.x += Math.cos(this.rotation);
                this.vel.y += Math.sin(this.rotation);
            }
            this.socket.emit('input', input);
        }

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        // TEST
        this.vel.x *= 0.95;
        this.vel.y *= 0.95;
    }

    draw(ctx) {
        if (!this.alive) return;
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rotation + Math.PI / 2);
        ctx.translate(-this.pos.x, -this.pos.y);
        if (this.thrust) {
            if (this.tick%10 > 5) {
                ctx.drawImage(this.spriteT, this.pos.x - 19, this.pos.y - 24);
            } else {
                ctx.drawImage(this.spriteT2, this.pos.x - 19, this.pos.y - 24);
            }
        } else {
            ctx.drawImage(this.sprite, this.pos.x - 19, this.pos.y - 24);
        }
        ctx.restore();
    }
}

module.exports = Player;
