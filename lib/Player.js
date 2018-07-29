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
        this.score = 0;
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
     * Generates object representing the current state of the player
     * @return {Object} Object containing state information
     */
    getState() {
        let state = {
            id: this.id,
            username: this.name, //TODO Dont sent username all the time
            x: this.pos.x,
            y: this.pos.y,
            vx: this.vel.x,
            vy: this.vel.y,
            rotation: this.rotation
        };
        return state;
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

        this.pos = this.pos.add(this.vel);
        this.vel = this.vel.scale(0.9);

        this.score++;

    }
}

module.exports = Player;
