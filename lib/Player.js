'use strict';

const Vector2 = require('../../src/util/Vector2');

class Player {
    /**
     * Constructor
     * @constructor
     * @param {string} name The IGN of the player
     * @param {Socket} socket The socket object of the player
     * @param {Vector2} pos The player starting position
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
        this.vel = new Vector2(0, 0);
        this.rotation = 0.0;
        this.score = 0;
        this.alive = true;
        this.thrusting = false;
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
            x: this.pos.x,
            y: this.pos.y,
            vx: this.vel.x,
            vy: this.vel.y,
            rotation: this.rotation,
            thrust: this.thrusting,
            alive: this.alive
        };
        return state;
    }

    /**
     * Generates object containing the player's Id and Name
     * @return {Object} Object containing id and username
     */
    getIdAndName() {
        let info = {id: this.socket.id, username: this.name};
        return info;
    }

    /**
     * Updates the player
     * @param {Number} delta time in seconds since last update
     */
    update(delta) {
        this.thrusting = false;
        let thrust = new Vector2(0,0);
        if(this.keys.W) {
            thrust.x = 30.0 * Math.cos(this.rotation);
            thrust.y = 30.0 * Math.sin(this.rotation);
            this.thrusting = true;
        }
        if (this.keys.A) {
            this.rotation -= 3.0 * delta;
        }
        if (this.keys.D) {
            this.rotation += 3.0 * delta;
        }

        this.vel = this.vel.add(thrust.subtract(this.vel.scale(1.75)).scale(delta));
        this.pos = this.pos.add(this.vel);

        this.score += 10.0 * delta;

    }
}

module.exports = Player;
