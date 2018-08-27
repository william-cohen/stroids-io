'use strict';

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const TICK_RATE = 30.0;

const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app).listen(PORT);
const io = require('socket.io')(server);

const Game = require('./lib/Game');

app.use(express.static('./public'));

const SERVER_START_TIME = Date.now();
const game = new Game();

function getServerTime() {
    return Date.now() - SERVER_START_TIME;
}

io.on('connection', function(socket) {
    socket.on('drip', function() {
        socket.emit('drop');
    });

    //Player joins (or rejoins) the game
    socket.on('join', function(name) {
        console.log('Player (id: ' + socket.id + ') has joined.');
        game.addPlayer(name, socket);
        socket.emit('message', 'Welcome! Use WASD to move.');
    });

    //Player presses some Keys, pass it onto the game
    socket.on('input',  function(keys) {
        game.updatePlayerInput(socket.id, keys);
    });

    socket.on('disconnect', function() {
        game.removePlayer(socket.id);
        console.log('Player (id: ' + socket.id + ') left.');
    });
});
let lastUpdate = Date.now();
//let tick = 0;
setInterval(function () {
    let delta = (Date.now() - lastUpdate)/1000;
    game.update(delta);
    lastUpdate = Date.now();

    //if (tick % 2 == 0) game.emit(getServerTime());
    game.emit(getServerTime());

    //tick++; tick %= 30;
}, 1000.0 / TICK_RATE);

console.log('Game server running on port: ' + PORT + '...');
