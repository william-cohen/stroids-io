/* global window, document, io, prompt */
const CONNECTION = process.env.SERVER_URL + ':' + process.env.PORT;
const GAME_SIZE = 1000;
const CANVAS_WIDTH = 0.95 * window.innerWidth;
const CANVAS_HEIGHT = 0.95 * window.innerHeight;

const PIXI = require('pixi.js');
const Viewport = require('pixi-viewport');
const MOBILE = require('is-mobile')();


WebFont.load({
    google: {
      families: ['Press Start 2P']
    }
  });

//Create a Pixi Application
const app = new PIXI.Application({
    width: CANVAS_WIDTH,         // default: 800
    height: CANVAS_HEIGHT,        // default: 600
    antialias: false,    // default: false
    transparent: false, // default: false
    resolution: 1       // default: 1
  }
);

const camera = new Viewport({
    screenWidth: CANVAS_WIDTH,
    screenHeight: CANVAS_HEIGHT,
    worldWidth: 1000,
    worldHeight: 1000,
    interaction: app.renderer.interaction
});

const gui = new Viewport({
    screenWidth: CANVAS_WIDTH,
    screenHeight: CANVAS_HEIGHT,
    worldWidth: 1000,
    worldHeight: 1000
});

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);
app.stage.addChild(camera);
app.stage.addChild(gui);

// activate plugins if not on mobile
if (!MOBILE)
    camera
        .drag()
        .pinch()
        .wheel()
        .decelerate();


const io = require('socket.io-client');
const socket = io(CONNECTION);

const HashMap = require('./hashmap');

const MobileControls = require('./mobile/MobileControls');

const UIOverlay = require('./UIOverlay'); //FIXME
const Player = require('./Player');
const Enemy = require('./Enemy');
const Asteroid = require('./Asteroid');
const Star = require('./Star'); //FIXME
const Latency = require('./Latency').init(socket);

const username = prompt('Please enter a username: ');
const graphics = new PIXI.Graphics();

let player = null;
let enemies = null;
let asteroids = null;
let leaderID = '';
let stars = null;
let numStars = null;
let ui = null;
let mobileControls = null;

PIXI.loader
  .add('assets/spritesheet.json')
  .load(setup);

function setup() {
    camera.addChild(graphics);

    ui = new UIOverlay(CANVAS_WIDTH, CANVAS_HEIGHT, MOBILE);
    ui.insertInto(gui);

    //FIXME DO THE CONTROLLER/KEYBOARD REFACTORING
    mobileControls = new MobileControls(CANVAS_WIDTH, CANVAS_HEIGHT);
    if (MOBILE) mobileControls.insertInto(gui);

    player = new Player(socket, mobileControls);
    camera.addChild(player.sprite);
    camera.follow(player.sprite);

    enemies = new HashMap();
    asteroids = [];
    leaderID = '';
    stars = [];
    const NUM_STARS = Math.round(CANVAS_WIDTH * CANVAS_HEIGHT * 0.00009);
    for (var i = 0; i < NUM_STARS; i++) {
        stars.push(new Star(3, GAME_SIZE, GAME_SIZE, player));
        stars.push(new Star(2, GAME_SIZE, GAME_SIZE, player));
        stars.push(new Star(1, GAME_SIZE, GAME_SIZE, player));
    }

    //Seup network event listeners (probably should refactor this)
    socket.on('pong', function(ms) {
        Latency.calc(ms);
        ui.setPing(ms);
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
        ui.setScore(player.score);

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
            let removedEnemy = enemies.get(removedEnemies[i]);
            removedEnemy.removeFrom(camera);
            enemies.delete(removedEnemy.id);
        }

        //Create player objects and mark with ID
        for (let i = 0; i < addedPlayers.length; i++) {
            let newPlayerInfo = addedPlayers[i];
            if (newPlayerInfo.id == player.id) continue;
            let newEnemy = new Enemy(newPlayerInfo.id, newPlayerInfo.username);
            enemies.set(newPlayerInfo.id, newEnemy);
            newEnemy.insertInto(camera);

        }

        //Create/update Asteroids as nessesary
        for (let i = 0; i < updatedAsteroids.length; i++) {
            let asteroidInfo = updatedAsteroids[i];
            let id = asteroidInfo.id;
            if (asteroids[id] == null) {
                asteroids[id] = new Asteroid(id%3+1);
                camera.addChild(asteroids[id].sprite);
            }
            asteroids[id].setState(asteroidInfo);
        }

        //Update name of leader (possible bug if leaderID not found?)
        if (player.alive) {
            if (leaderID == player.id) {
                ui.setLeaderText('You are the leader!');
            } else {
                let leaderName = enemies.get(leaderID);
                ui.setLeaderText('Leader: ' + leaderName);
            }
        }

    });


    //Setup game loop
    setInterval(function() {
        let delta = (Date.now() - lastUpdate)/1000;
        update(delta);
        lastUpdate = Date.now();
        draw();
    }, 1000/FPS);

}

function update(delta) {

    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update(delta);
    }

    for (let i = 0; i < asteroids.length; i++) {
        if (asteroids[i] == null) continue;
        asteroids[i].update(delta);
    }

    if (!player.alive) return;
    for (let i = 0; i < stars.length; i++) {
        stars[i].update();
    }
    player.update(delta);
}

function draw() {
    // if (player == null) return;

    graphics.clear();

    graphics.lineStyle(2, 0xffffff, 1);
    graphics.drawRect(0, 0, GAME_SIZE, GAME_SIZE);
    graphics.endFill();

    graphics.beginFill(0xffffff);
    graphics.lineStyle(0, 0x0, 0);
    for (let i = 0; i < stars.length; i++) {
        stars[i].draw(graphics);
    }
    graphics.endFill();

    let enemyArray = enemies.values();
    for (let i = 0; i < enemyArray.length; i++) {
        enemyArray[i].draw();
    }

    for (let i = 0; i < asteroids.length; i++) {
        if (asteroids[i] == null) continue;
        asteroids[i].draw();
    }

    if (player.alive) player.draw();


    if (!player.alive) {
        ui.notifyOfDeath();
    }
}

socket.emit('join', username);

const FPS = 30;
let lastUpdate = Date.now();

console.log('Stroids Client v0.3.2');
