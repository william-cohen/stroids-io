'use strict';

const Vector2 = require('../util/Vector2');

class PlayerStub {
    constructor(player) {
        this.pos = new Vector2(0.0, 0.0);
        this.player = player;
    }

    update() {
        this.pos = this.player.spos;
    }

    draw(g) {
        g.drawRect(this.pos.x, this.pos.y, 5, 5);
    }
}

module.exports = PlayerStub;
