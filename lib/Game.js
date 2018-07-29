'use strict';

const HashMap = require('hashmap');
const Player = require('./Player');
const Vector2f = require('../util/Vector2f');

const GAME_SIZE = 1000;

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
        this.removedPlayers = [];
        this.leaderID = '';
    }

    /**
     * Adds a player into the game
     * @param {string} name The IGN of the player
     * @param {Socket} socket The socket object of the player
     */
    addPlayer(name, socket) {
        let startPos = new Vector2f(Math.random()*GAME_SIZE, Math.random()*GAME_SIZE);
        this.players.set(socket.id, new Player(name, socket, startPos));
    }

    /**
     * Updates a players pending input by socket id
     * @param {string} id The socket id of the player
     * @param {Object} keys JSON object containing the key presses
     */
    updatePlayerInput(id, keys) {
        if (!this.players.has(id)) return;
        let player = this.players.get(id);
        player.setKeys(keys);
    }

    /**
     * Removes a player from the game
     * @param {string} id The socker id of the player to remove
     */
    removePlayer(id) {
        this.removedPlayers.push(id);
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
            //TODO Check distance
            let playerState = playerArray[i].getState();
            if (playerState.id === player.id) continue;
            states.push(playerState);
        }
        return states;
    }
    /**
     * Gets the info of any asteroid that recently respawn
     * @return {Array.<Object>} Array of asteroid states
     */
    getAsteroidUpdates() {
        //TODO Implement
        return null;
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
                asteroids: this.getAsteroidUpdates(),
                enemies: this.getPlayerStatesVisibleTo(player),
                removedEnemies: this.removedPlayers,
                player: player.getState(),
                score: player.score,
                leader: null
            };
            player.socket.emit('state', state);
        }

        this.removedPlayers = [];
    }
}

module.exports = Game;
