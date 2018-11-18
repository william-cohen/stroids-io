/* global window, document, io, prompt */
const CONNECTION = process.env.SERVER_URL + ':' + process.env.PORT;
const GAME_SIZE = 1000;
const CANVAS_WIDTH = 0.95 * window.innerWidth;
const CANVAS_HEIGHT = 0.95 * window.innerHeight;
const canvas = document.getElementById('gameCanvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const ctx = canvas.getContext('2d');

const io = require('socket.io-client');
const socket = io(CONNECTION);

const Player = require('./Player');
const Enemy = require('./Enemy');
const Asteroid = require('./Asteroid');
const HashMap = require('./hashmap');
const Star = require('./Star');
const Latency = require('./Latency').init(socket);

const username = prompt('Please enter a username: ');

socket.emit('join', username);

let player = new Player(socket);
let enemies = new HashMap();
let asteroids = [];
let leaderID = '';
let stars = [];
let numStars = Math.round(CANVAS_WIDTH * CANVAS_HEIGHT * 0.000018);
for (var i = 0; i < numStars; i++) {
    stars.push(new Star(3, GAME_SIZE, GAME_SIZE, player));
    stars.push(new Star(2, GAME_SIZE, GAME_SIZE, player));
    stars.push(new Star(1, GAME_SIZE, GAME_SIZE, player));
}

socket.on('pong', function(ms) {
    Latency.calc(ms);
    console.log('Pong: ' + ms);
});

socket.on('message', function(text) {
    console.log('Message: ' + text);
});

socket.on('state', function(state) {
    leaderID = state.leader;
    let playerState = state.player;
    let enemyStates = state.enemies || []; //
    let removedEnemies = state.removedPlayers;
    let addedPlayers = state.addedPlayers;
    let updatedAsteroids = state.updatedAsteroids;

    //Update player state
    player.updateState(playerState);
    player.score = state.score;

    //Update enemies state
    for (let i = 0; i < enemyStates.length; i++) {
        let enemyState = enemyStates[i];
        let enemy_id = enemyState.id;
        if (!enemies.has(enemy_id)) {
            enemies.set(enemy_id, new Enemy(enemy_id, ''));
        }
        enemies.get(enemy_id).updateState(enemyState);
    }

    //Remove enemies who left since last tick
    for (let i = 0; i < removedEnemies.length; i++) {
        enemies.delete(removedEnemies[i]);
    }

    //Create player objects and mark with ID
    for (let i = 0; i < addedPlayers.length; i++) {
        let newPlayerInfo = addedPlayers[i];
        if (newPlayerInfo.id == player.id) continue;
        enemies.set(newPlayerInfo.id, new Enemy(newPlayerInfo.id, newPlayerInfo.username));
    }

    //Create/update Asteroids as nessesary
    for (let i = 0; i < updatedAsteroids.length; i++) {
        let asteroidInfo = updatedAsteroids[i];
        let id = asteroidInfo.id;
        if (asteroids[id] == null) asteroids[id] = new Asteroid(id%3+1);
        asteroids[id].setState(asteroidInfo);
    }

});

function update(delta) {

    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update(delta);
    }

    for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].update(delta);
    }


    if (!player.alive) return;
    for (let i = 0; i < stars.length; i++) {
        stars[i].update();
    }
    player.update(delta);
}

function draw() {
    if (player == null) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.setTransform(1, 0, 0, 1, CANVAS_WIDTH / 2 - player.pos.x, CANVAS_HEIGHT / 2 - player.pos.y);

    ctx.strokeStyle = 'white';
    ctx.strokeRect(0,0, GAME_SIZE, GAME_SIZE);

    for (let i = 0; i < stars.length; i++) {
        stars[i].draw(ctx);
    }

    let enemyArray = enemies.values();
    for (let i = 0; i < enemyArray.length; i++) {
        enemyArray[i].draw(ctx);
    }

    for (let i = 0; i < asteroids.length; i++) {
        if (asteroids[i] == null) continue;
        asteroids[i].draw(ctx);
    }

    if (player.alive) player.draw(ctx);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.font = '12px serif';
    ctx.fillStyle = 'white';
    ctx.fillText('Ping: ' + Latency.currentLatency, CANVAS_WIDTH - 100, 10);

    ctx.font = '14px serif';
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + player.score, 20, 20);

    ctx.font = '24px serif';
    ctx.fillStyle = 'white';
    let leaderText = (leaderID == player.id ? 'You are the leader.' : 'Leader: ' + (enemies.get(leaderID) || {username: ' '}).username);
    ctx.fillText(leaderText, CANVAS_WIDTH/2 - 50, 20);

    if (!player.alive) {
        ctx.font = '32px serif';
        ctx.fillStyle = 'white';
        ctx.fillText('You died.', 50, 150);
    }
}

const FPS = 30;
let lastUpdate = Date.now();
setInterval(function() {
    let delta = (Date.now() - lastUpdate)/1000;
    update(delta);
    lastUpdate = Date.now();
    draw();
}, 1000/FPS);

console.log('Client v0.2.2');
