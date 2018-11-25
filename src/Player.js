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
        this.sprite = new PIXI.Sprite(PIXI.loader.resources['assets/spritesheet.json'].textures['player.png']);
        this.sprite.anchor.set(0.5);
    }

    updateState(state) {
        this.id = state.id;
        this.pos.x = state.x;
        this.pos.y = state.y;
        this.vel.x = state.vx;
        this.vel.y = state.vy;
        this.rotation = state.rotation;
        this.alive = state.alive;

        //XXX
        if (!this.alive) this.sprite.visible = false;
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

    draw() {
        if (!this.alive) return;
        this.sprite.x = this.pos.x;
        this.sprite.y = this.pos.y;

        this.sprite.rotation = this.rotation + Math.PI/2;
    }
}

module.exports = Player;
