/* global window, document, io, prompt */
const CONNECTION = 'http://127.0.0.1:3000';
const GAME_SIZE = 1000;
const CANVAS_WIDTH = 0.95 * window.innerWidth;
const CANVAS_HEIGHT = 0.95 * window.innerHeight;
const canvas = document.getElementById('gameCanvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const ctx = canvas.getContext('2d');

const Player = require('./Player');
const Enemy = require('./Enemy');
const HashMap = require('./hashmap');
const Star = require('./Star');

const username = prompt('Please enter a username: ');

const socket = io(CONNECTION);

socket.emit('join', username);

let player = new Player(socket);
let enemies = new HashMap();
let leaderID = '';
let stars = [];
let numStars = Math.round(CANVAS_WIDTH * CANVAS_HEIGHT * 0.000018);
for (var i = 0; i < numStars; i++) {
    stars.push(new Star(3, GAME_SIZE, GAME_SIZE, player));
    stars.push(new Star(2, GAME_SIZE, GAME_SIZE, player));
    stars.push(new Star(1, GAME_SIZE, GAME_SIZE, player));
}

socket.on('message', function(text) {
    console.log('Message: ' + text);
});

socket.on('state', function(state) {
    leaderID = state.leader;
    let player_state = state.player;
    let enemy_states = state.enemies || []; //
    let removedEnemies = state.removedEnemies;

    //Update player state
    player.setState(player_state);
    player.score = state.score;

    //Update enemies state
    for (let i = 0; i < enemy_states.length; i++) {
        let enemy_state = enemy_states[i];
        let enemy_id = enemy_state.id;
        if (!enemies.has(enemy_id)) {
            enemies.set(enemy_id, new Enemy(enemy_id, enemy_state.username));
        }
        enemies.get(enemy_id).setState(enemy_state);
    }

    //Remove enemies who left since last tick
    for (let i = 0; i < removedEnemies.length; i++) {
        enemies.delete(removedEnemies[i]);
    }

});

function update() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update();
    }

    if (!player.alive) return;
    for (let i = 0; i < stars.length; i++) {
        stars[i].update();
    }
    player.update();
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
    for (var i = 0; i < enemyArray.length; i++) {
        enemyArray[i].draw(ctx);
    }

    if (player.alive) player.draw(ctx);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.font = '12px serif';
    ctx.fillStyle = 'white';
    ctx.fillText('Ping: ' + 'null', CANVAS_WIDTH - 100, 10);

    ctx.font = '14px serif';
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + player.score, 20, 20);

    ctx.font = '24px serif';
    ctx.fillStyle = 'white';
    let leaderText = (leaderID == player.id ? 'You are the leader.' : 'Leader: ' + enemies.get(leaderID).username);
    ctx.fillText(leaderText, CANVAS_WIDTH/2 - 50, 20);

    if (!player.alive) {
        ctx.font = '32px serif';
        ctx.fillStyle = 'white';
        ctx.fillText('You died.', 50, 150);
    }

const FPS = 30;
setInterval(function() {
    update();
    draw();
}, 1000/FPS);

console.log('Client v0.1.5');
