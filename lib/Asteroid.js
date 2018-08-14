'use strict';

const Vector2f = require('../util/Vector2f');

class Asteroid {
    constructor(id, x, y) {
        this.id = id;
        this.pos = new Vector2f(x,y);
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
        this.vel = new Vector2f(
            Math.cos(theta)*(6-1.5*this.size),
            Math.sin(theta)*(6-1.5*this.size));
    }


    update() {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
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
