'use strict';

const Vector2 = require('../util/Vector2');
const VEL_SCALE = 30;

class Asteroid {
    constructor(id, x, y) {
        this.id = id;
        this.pos = new Vector2(x,y);
        var theta = Math.random()*Math.PI*2;
        this.size = id%3+1;
        this.radius = 0;
        switch (this.size) {
        case 1:
            this.radius = 10;
            break;
        case 2:
            this.radius = 15;
            break;
        case 3:
            this.radius = 25;
            break;
        default:
            break;
        }
        this.vel = new Vector2(
            VEL_SCALE*Math.cos(theta)*(6-1.5*this.size),
            VEL_SCALE*Math.sin(theta)*(6-1.5*this.size));
    }


    update(delta) {
        this.pos.x += this.vel.x*delta;
        this.pos.y += this.vel.y*delta;
    }

    getInfo() {
        var info = {
            x: this.pos.x,
            y: this.pos.y,
            vx: this.vel.x,
            vy: this.vel.y,
            id: this.id
        };
        return info;
    }
}

module.exports = Asteroid;
