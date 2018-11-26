/* global Image */
const Vector2 = require('../util/Vector2');
const hspline = require('../util/HermiteSpline');
const Util = require('../util/Util');

class Enemy {
    constructor(id, username) {
        this.id = id;
        this.username = username;

        this.pos = new Vector2(0.0, 0.0);
        this.vel = new Vector2(0.0, 0.0);
        this.rotation = 0.0;
        this.oldPos = new Vector2(0.0, 0.0);
        this.oldVel = new Vector2(0.0, 0.0);
        this.oldRotation = 0.0;
        this.lerp_t = 0;

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
        this.thrust = false;
        this.alive = true;

        this.nametag = new PIXI.Text(
            this.username,
            new PIXI.TextStyle({fontFamily: 'Arial', fontSize: 12, fill: 'white'})
        );
    }

    insertInto(camera) {
        camera.addChild(this.sprite);
        camera.addChild(this.nametag);
    }

    removeFrom(camera) {
        camera.removeChild(this.sprite);
        camera.removeChild(this.nametag);
    }

    updateState(state) {
        this.oldPos = this.pos.clone();
        this.oldVel = this.vel.clone();
        this.oldRotation = this.rotation;
        this.lerp_t = 0;

        this.pos.x = state.x;
        this.pos.y = state.y;
        this.vel.x = state.vx;
        this.vel.y = state.vy;

        this.rotation = state.rotation;
        this.thrust = state.thrust;
        this.alive = state.alive;
    }

    update(delta) {
        if (!this.alive) return;

        this.tick++;
        this.tick %= 6;

        //this.pos.x += this.vel.x*delta;
        //this.pos.y += this.vel.y*delta;
    }

    draw(ctx) {
        if (!this.alive) return;

        //XXX Assumed network tickrate of 6Hz
        this.lerp_t += 1.0/6.0;

        //Hermite Spline interpolation (very smooth)
        let p = hspline(this.oldPos, this.oldVel, this.pos, this.vel, this.lerp_t);
        let angleDelta = Util.angleDelta(this.rotation, this.oldRotation);
        //Linear angle interpolation
        let angle = this.oldRotation + angleDelta*this.lerp_t;

        // ctx.save();
        // ctx.translate(p.x, p.y);
        // ctx.rotate(angle + Math.PI/2);
        // ctx.translate(-p.x, -p.y);
        // if (this.thrust) {
        //     if (this.tick > 2) {
        //         ctx.drawImage(this.spriteT, p.x - 19, p.y - 24);
        //     } else {
        //         ctx.drawImage(this.spriteT2, p.x - 19, p.y - 24);
        //     }
        // } else {
        //     ctx.drawImage(this.sprite, p.x - 19, p.y - 24);
        // }
        // ctx.restore();
        // ctx.font = '12px serif';
        // ctx.fillStyle = 'white';
        // ctx.fillText(this.username, p.x - 25, p.y + 45);

        if (!this.thrust) {
            this.sprite.gotoAndStop(0);
        } else {
            this.sprite.play();
        }
        this.sprite.x = p.x;
        this.sprite.y = p.y;

        this.sprite.rotation = angle + Math.PI/2;

        this.nametag.position.set(p.x - 25, p.y + 30); //TUNE
    }
}

module.exports = Enemy;
