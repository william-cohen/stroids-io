/* global Image */

const Vector2 = require('../util/Vector2');

class Player {
    constructor(socket, controller) {
        this.tick = 0;
        this.socket = socket;
        this.id = 'null';
        
        this.controller = controller;

        this.alive = true;
        this.thrust = false;

        this.pos = new Vector2(0.0, 0.0);
        this.vel = new Vector2(0.0, 0.0);

        this.rotation = 0.0;

        let frames = [
            PIXI.loader.resources['assets/spritesheet.json'].textures['player.png'],
            PIXI.loader.resources['assets/spritesheet.json'].textures['playerT.png'],
            PIXI.loader.resources['assets/spritesheet.json'].textures['playerT2.png']
        ];
        this.sprite = new PIXI.extras.AnimatedSprite(frames);
        this.sprite.anchor.set(0.5);
        this.sprite.animationSpeed = 0.2;
        this.sprite.onLoop = () => {
            this.sprite.gotoAndPlay(1);
        };
        this.sprite.play();
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
        this.tick++; this.tick %= 30;
        if (this.alive) {
            this.thrust = false;

            this.tick++;
            this.tick %= 30;

            //Left Arrow Key
            if (this.controller.input.A) {
                this.rotation -= 3.0 * delta;
            }
            //Right Arrow Key
            if (this.controller.input.D) {
                this.rotation += 3.0 * delta;
            }
            //Up Arrow Key
            if (this.controller.input.W) {
                this.thrust = true;
                thrust.x = 30.0 * Math.cos(this.rotation);
                thrust.y = 30.0 * Math.sin(this.rotation);
            }
            this.socket.emit('input', this.controller.input);
        }

        this.vel = this.vel.add(thrust.subtract(this.vel.scale(1.75)).scale(delta));
        this.pos = this.pos.add(this.vel);
    }

    draw() {
        if (!this.alive) return;
        if (!this.thrust) {
            this.sprite.gotoAndStop(0);
        } else {
            this.sprite.play();
        }
        this.sprite.x = this.pos.x;
        this.sprite.y = this.pos.y;

        this.sprite.rotation = this.rotation + Math.PI/2;
    }
}

module.exports = Player;
