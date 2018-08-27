/* global Image */

const KeyListener = require('./KeyListener');
const Vector2 = require('../util/Vector2');

class Player {
    constructor(socket) {
        this.tick = 0;
        this.socket = socket;
        this.id = 'null';

        this.alive = true;

        this.pos = new Vector2(0.0, 0.0);
        this.vel = new Vector2(0.0, 0.0);

        this.rotation = 0.0;
        this.keys = new KeyListener();
        this.sprite = new Image();
        this.sprite.src = 'img/player.png';
        this.spriteT = new Image();
        this.spriteT.src = 'img/playerT.png';
        this.spriteT2 = new Image();
        this.spriteT2.src = 'img/playerT2.png';
    }

    updateState(state) {
        this.id = state.id;
        this.pos.x = state.x;
        this.pos.y = state.y;
        this.vel.x = state.vx;
        this.vel.y = state.vy;
        this.rotation = state.rotation;
        this.alive = state.alive;
    }

    update(delta) {
        let thrust = new Vector2(0,0);
        let input = {
            'W' : false,
            'A' : false,
            'S' : false,
            'D' : false
        };
        this.tick++; this.tick %= 30;
        if (this.alive) {
            this.thrusting = false;

            this.tick++;
            this.tick %= 30;

            //Left Arrow Key
            if (this.keys.isPressed(37)) {
                input.A = true;
                //
                this.rotation -= 3.0 * delta;
            }
            //Right Arrow Key
            if (this.keys.isPressed(39)) {
                input.D = true;
                //
                this.rotation += 3.0 * delta;
            }
            //Up Arrow Key
            if (this.keys.isPressed(38) || this.keys.isPressed(32)) {
                input.W = true;
                this.thrusting = true;
                thrust.x = 30.0 * Math.cos(this.rotation);
                thrust.y = 30.0 * Math.sin(this.rotation);
            }
            this.socket.emit('input', input);
        }

        this.vel = this.vel.add(thrust.subtract(this.vel.scale(1.75)).scale(delta));
        this.pos = this.pos.add(this.vel);
    }

    draw(ctx) {
        if (!this.alive) return;

        //let p = lerp()

        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rotation + Math.PI / 2);
        ctx.translate(-this.pos.x, -this.pos.y);
        if (this.thrusting) {
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
