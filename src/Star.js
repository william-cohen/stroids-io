'use strict';

class Star {

    constructor(size, maxX, maxY, player) {
        this.x = Math.random() * maxX;
        this.y = Math.random() * maxY;
        this.maxX = maxX;
        this.maxY = maxY;
        this.player = player;
        this.size = size;
    }

    update() {
        if (this.x < 0) this.x += this.maxX;
        if (this.x > this.maxX) this.x -= this.maxX;
        if (this.y < 0) this.y += this.maxY;
        if (this.y > this.maxY) this.y -= this.maxY;

        switch (this.size) {
        case 1:
            this.x += 0.5 * this.player.vel.x;
            this.y += 0.5 * this.player.vel.y;
            break;
        case 2:
            this.x += 0.5 * 0.66 * this.player.vel.x;
            this.y += 0.5 * 0.66 * this.player.vel.y;
            break;
        case 3:
            this.x += 0.5 * 0.33 * this.player.vel.x;
            this.y += 0.5 * 0.33 * this.player.vel.y;
            break;
        default:
            break;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.closePath();
    }
}

module.exports = Star;
