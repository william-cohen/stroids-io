'use strict';

const HashMap = require('hashmap');
const Player = require('./Player');
const Vector2f = require('../util/Vector2f');

const GAME_SIZE = 3000;

/**
 * Game
 */
class Game {
    /**
     * Game constructor
     * @constructor
     */
    constructor() {
        this.players = new HashMap();
    }

    /**
     * Adds a player into the game
     * @param {string} name The IGN of the player
     * @param {Socket} socket The socket object of the player
     */
    addPlayer(name, socket) {
        let startPos = new Vector2f(Math.random()*GAME_SIZE, Math.random()*GAME_SIZE);
        this.players.set(socket.id, new Player(name, socket, startPos));
        console.log('Player added. Total players: ' + this.players.size);
    }

    /**
     * Updates a players pending input by socket id
     * @param {string} id The socket id of the player
     * @param {Object} keys JSON object containing the key presses
     */
    updatePlayerInput(id, keys) {
        let player = this.players.get(id);
        player.setInput(keys);
    }

    /**
     * Removes a player from the game
     * @param {string} id The socker id of the player to remove
     */
    removePlayer(id) {
        this.players.delete(id);
    }

    /**
     * Gets the states of all players visbile to the passed player
     * @param {Player} player The player
     * @return {Array.<Object>} Array of player states visible to 'player'
     */
    getPlayerStatesVisibleTo(player) {
        let states = [];
        let playerArray = this.players.values();
        for (let i = 0; i < playerArray.length; i++) {
            let dist = playerArray[i].pos.subtract(player.pos).mag2();
            if (dist < 10000) {
                states.push(playerArray[i].getState());
            }
        }
    }

    /**
     * Updates all the players, asteroids, ect
     */
    update() {
        let playerArray = this.players.values();
        for (let i = 0; i < playerArray.length; i++) {
            playerArray[i].update();
        }
    }

    /**
     * Emits the current game-state to all players
     * @param {number} time The current server-time for timestamp
     */
    emit(time) {
        let playerArray = this.players.values();
        for (let i = 0; i < playerArray.length; i++) {
            let player = playerArray[i];
            let state = {
                timestamp: time,
                players: this.getPlayerStatesVisibleTo(player),
                leader: null
            };
            player.socket.emit('state', state);
        }
    }
}

module.exports = Game;
