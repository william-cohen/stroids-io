'use strict';

const Vector2f = require('../util/Vector2f');

class Player {
    /**
     * Constructor
     * @constructor
     * @param {string} name The IGN of the player
     * @param {Socket} socket The socket object of the player
     * @param {Vector2f} pos The player starting position
     */
    constructor(name, socket, pos) {
        this.name = name;
        this.id = socket.id;
        this.socket = socket;
        this.keys = {
            'W' : false,
            'A' : false,
            'S' : false,
            'D' : false
        };
        this.pos = pos;
        this.vel = new Vector2f(0, 0);
        this.rotation = 0.0;
    }

    /**
     * Updates the players key presses
     * @param {Object} keys The key presses of the player
     */
    setKeys(keys) {
        this.keys.W = keys.W;
        this.keys.A = keys.A;
        this.keys.S = keys.S;
        this.keys.D = keys.D;
    }

    /**
     * Updates the player
     */
    update() {
        if(this.keys.W) {
            this.vel.x += Math.cos(this.rotation);
            this.vel.y += Math.sin(this.rotation);
            this.keys.W = false;
        }
        if (this.keys.A) {
            this.rotation -= 0.1;
            this.keys.A = false;
        }
        if (this.keys.D) {
            this.rotation += 0.1;
            this.keys.D = false;
        }
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

    }
}

module.exports = Player;
