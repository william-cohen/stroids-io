'use strict';
/**
 * Game
 */
class Game {

    constructor() {

    }

    /**
     * Adds a player into the game
     * @param {string} name The IGN of the player
     * @param {Socket} socket The socket object of the player
     */
    addPlayer(name, socket) {
        //TODO
    }

    /**
     * Updates a players pending input by socket id
     * @param {string} id The socket id of the player
     * @param {Object} keys JSON object containing the key presses
     */
    updatePlayerInput(id, keys) {
        //TODO
    }

    /**
     * Removes a player from the game
     * @param {string} id The socker id of the player to remove
     */
    removePlayer(id) {
        //TODO
    }

    /**
     * Updates all the players, asteroids, ect
     */
    update() {

    }

    emit() {

    }
}

module.exports = Game;
