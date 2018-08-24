'use strict';

const HashMap = require('hashmap');
const Player = require('./Player');
const Asteroid = require('./Asteroid');
const Vector2 = require('../util/Vector2');

const GAME_SIZE = 1000;
const PLAYER_SIZE = 30;
const NUM_ASTEROIDS = 20;

class Game {
    /**
     * Game
     * @constructor
     */
    constructor() {
        this.players = new HashMap(); //All players currently in the game. Key'd by socket Id
        this.asteroids = new Array(NUM_ASTEROIDS);
        this.addedPlayers = []; //Array of (id, username) pairs of recently added players
        this.removedPlayers = []; //Array of player IDs of recently removed players
        this.leaderID = ''; //String of the socket ID of the leading player
        this.updatedAsteroids = []; //Array of number id's for the asteroids recently updated
        //Construct asteroids
        for (let i = 0; i < NUM_ASTEROIDS; i++) {
            this.asteroids[i] = new Asteroid(
                i,
                GAME_SIZE*Math.random(),
                GAME_SIZE*Math.random());
        }
    }

    /**
     * Adds a player into the game
     * @param {string} name The IGN of the player
     * @param {Socket} socket The socket object of the player
     */
    addPlayer(name, socket) {
        let startPos = new Vector2(
            Math.random()*(GAME_SIZE - 2*PLAYER_SIZE) + 2*PLAYER_SIZE,
            Math.random()*(GAME_SIZE - 2*PLAYER_SIZE) + 2*PLAYER_SIZE);
        let newPlayer = new Player(name, socket, startPos);
        this.players.set(socket.id, newPlayer);
        this.addedPlayers.push(newPlayer.getIdAndName());
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
     * Gets the info of any asteroid that recently changed states
     * @return {Array.<Object>} Array of asteroid states
     */
    getAsteroidUpdates() {
        let updates = [];
        for (let i = 0; i < this.updatedAsteroids.length; i++) {
            let id = this.updatedAsteroids[i];
            updates.push(this.asteroids[id].getInfo());
        }
        return updates;
    }

    /**
     * Updates all the players, asteroids, ect
     * @param {Number} delta time in seconds since last update
     */

    update(delta) {
        let playerArray = this.players.values();
        let leadingPlayer = this.players.get(this.leaderID) || {id: 'null', score: -1.0};

        //Update asteroids
        for (let j = 0; j < NUM_ASTEROIDS; j++) {
            let asteroid = this.asteroids[j];
            let respawn = false;
            asteroid.update(delta);

            if (asteroid.pos.x < 0) {
                asteroid.pos.x += GAME_SIZE;
                respawn = true;
            }
            if (asteroid.pos.x > GAME_SIZE) {
                asteroid.pos.x -= GAME_SIZE;
                respawn = true;
            }
            if (asteroid.pos.y < 0) {
                asteroid.pos.y += GAME_SIZE;
                respawn = true;
            }
            if (asteroid.pos.y > GAME_SIZE) {
                asteroid.pos.y -= GAME_SIZE;
                respawn = true;
            }

            if (respawn) this.updatedAsteroids.push(asteroid.id);
        }

        //Update players and check collision
        for (let i = 0; i < playerArray.length; i++) {
            let player = playerArray[i];
            if (!player.alive) continue;
            player.update(delta);
            if (player.score < 20) continue;

            if (player.score > leadingPlayer.score) leadingPlayer = player;
            if (player.pos.x < PLAYER_SIZE || player.pos.x > GAME_SIZE - PLAYER_SIZE) player.alive = false;
            if (player.pos.y < PLAYER_SIZE || player.pos.y > GAME_SIZE - PLAYER_SIZE) player.alive = false;

            //TODO Implement Sweep and Prune O(n*logn) collision detection for large player numbers
            for (let j = 0; j != i && j < playerArray.length; j++) {
                let playerTwo = playerArray[j];
                if (player.pos.subtract(playerTwo.pos).mag2() < PLAYER_SIZE*PLAYER_SIZE) {
                    player.alive = false;
                    playerTwo.alive = false;
                }
            }

            for (let j = 0; j < NUM_ASTEROIDS; j++) {
                let asteroid = this.asteroids[j];
                if (player.pos.subtract(asteroid.pos).mag2() < (PLAYER_SIZE/2+asteroid.radius)*(PLAYER_SIZE/2+asteroid.radius)) {
                    player.alive = false;
                }
            }

        }

        this.leaderID = leadingPlayer.id;
    }

    /**
     * Generates array of player name and ids
     * @return {Array.<Object>} Array of Object containing state information
     */
    getAllPlayersIdAndName() {
        let array = [];
        let playerArray = this.players.values();
        for (let i = 0; i < playerArray.length; i++) {
            array.push(playerArray[i].getIdAndName());
        }
        return array;
    }

    /**
     * Generates array of all asteroids in the game
     * @return {Array.<Object>} Array of Object containing asteroid information
     */
    getAllAsteroidsInfo() {
        let array = [];
        for (let i = 0; i < this.asteroids.length; i++) {
            array.push(this.asteroids[i].getInfo());
        }
        return array;
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
                removedPlayers: this.removedPlayers,
                addedPlayers: this.addedPlayers,
                updatedAsteroids: this.getAsteroidUpdates(),
                player: player.getState(),
                score: Math.round(player.score),
                leader: this.leaderID
            };

            for (let j = 0; j < this.addedPlayers.length; j++) {
                if (this.addedPlayers[j].id == player.id) {
                    state.addedPlayers = this.getAllPlayersIdAndName();
                    state.updatedAsteroids = this.getAllAsteroidsInfo();
                    break;
                }
            }
            player.socket.emit('state', state);
        }

        this.removedPlayers = [];
        this.addedPlayers = [];
        this.updatedAsteroids = [];
    }
}

module.exports = Game;
