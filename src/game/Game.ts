/* global process, window, document, require, prompt */
import { Application, Graphics, loader } from 'pixi.js';
import Viewport from 'pixi-viewport';
import IsMobile from 'is-mobile';
import io from 'socket.io-client';
import HashMap from 'hashmap';
import WebFont from 'webfontloader';

import KeyboardControls from './controls/KeyboardControls';
import MobileControls from './controls/MobileControls';
import UIOverlay from './UIOverlay'; //FIXME
import Player from './Player';
import Enemy from './Enemy';
import Asteroid from './Asteroid';
import Star from './Star'; //FIXME
import Latency from './Latency';
import Controls from './controls/Controls';
import { GameStatePacket, PlayerStatePacket, AsteroidStatePacket, AddedPlayerPacket, InitialStatePakcet } from './NetworkPackets';

//@ts-ignore: no compatible call siganatures
const IS_MOBILE: boolean = IsMobile();
const CONNECTION: string = "127.0.0.1:3001"; //process.env.SERVER_URL;
const GAME_SIZE: number = 1000;
const CANVAS_WIDTH: number = 0.95 * window.innerWidth;
const CANVAS_HEIGHT: number = 0.95 * window.innerHeight;

console.log('Connecting to ' + CONNECTION);
const socket = io(CONNECTION);
const Ping = Latency.init(socket);

class Game {
    constructor(username: string) {
        //Create a Pixi Application
        const app = new Application({
            width: CANVAS_WIDTH,         // default: 800
            height: CANVAS_HEIGHT,        // default: 600
            antialias: false,    // default: false
            transparent: false, // default: false
            resolution: 1       // default: 1
        });
        
        const camera = new Viewport({
            screenWidth: CANVAS_WIDTH,
            screenHeight: CANVAS_HEIGHT,
            worldWidth: 1000,
            worldHeight: 1000
        });
        
        const gui = new Viewport({
            screenWidth: CANVAS_WIDTH,
            screenHeight: CANVAS_HEIGHT,
            worldWidth: 1000,
            worldHeight: 1000
        });

        WebFont.load({
            custom: {
              families: ['RetroComputer']
            }
          });
        
        //Add the canvas that Pixi automatically created for you to the HTML document
        document.body.appendChild(app.view);
        app.stage.addChild(camera);
        app.stage.addChild(gui);
        
        // activate plugins if not on mobile
        if (IS_MOBILE)
            camera
                .drag()
                .pinch()
                .wheel()
                .decelerate();
        
        const graphics = new Graphics();
        
        let player: Player;
        // let playerStub = null;
        // let stubGraphics = new PIXI.Graphics();
        
        let enemies: HashMap<string, Enemy>;
        let asteroids: Array<Asteroid>;
        let leaderID: string;
        let stars: Array<Star>;
        let ui: UIOverlay;
        let playerControls: Controls;
        
        loader
            .add('assets/spritesheet.json')
            .load(setup);
        
        function setup() {
            camera.addChild(graphics);
        
            ui = new UIOverlay(CANVAS_WIDTH, username);
            ui.insertInto(gui);
        
            if (IS_MOBILE) {
                playerControls = new MobileControls(CANVAS_WIDTH, CANVAS_HEIGHT);
                (playerControls as MobileControls).insertInto(gui);
            } else {
                playerControls = new KeyboardControls();
            }
        
            player = new Player(socket, username, playerControls);
            playerControls.setObserver(player);
            player.insertInto(camera);
        
            enemies = new HashMap();
            asteroids = [];
            leaderID = '';
            Star.setMaxBounds(GAME_SIZE, GAME_SIZE);
            stars = [];
            const NUM_STARS = Math.round(CANVAS_WIDTH * CANVAS_HEIGHT * 0.000045);
            for (var i = 0; i < NUM_STARS; i++) {
                stars.push(new Star(3, player));
                stars.push(new Star(2, player));
                stars.push(new Star(1, player));
            }
        
            //Seup network event listeners (probably should refactor this)
            socket.on('pong', function(ms: number) {
                Ping.calc(ms);
                ui.setPing(ms);
            });
        
            socket.on('message', function(text: string) {
                //TODO make the message show properly
                // eslint-disable-next-line no-console
                console.log('Message: ' + text);
            });

            socket.on('init', function (state: InitialStatePakcet, ack: (arg: string) => any) {
                console.log('init');
                console.log(state);

                player.updateState(state.player);

                //Create Asteroids
                for (let i = 0; i < state.asteroids.length; i++) {
                    let asteroidInfo: AsteroidStatePacket = state.asteroids[i];
                    let id: number = asteroidInfo.id;
                    if (asteroids[id] == null) {
                        asteroids[id] = new Asteroid(id%3+1);
                        camera.addChild(asteroids[id].getSprite());
                    }
                    asteroids[id].setState(asteroidInfo);
                }

                for (let i = 0; i < state.enemies.length; i++) {
                    let enemyInfo = state.enemies[i];
                    let newEnemy = new Enemy(enemyInfo.id, enemyInfo.username)
                    enemies.set(enemyInfo.id, newEnemy);
                    newEnemy.insertInto(camera);
                    
                }

                if (ack) {
                    ack("ack");
                }

                console.log(enemies);
            });

            socket.on('add_player', function(newPlayerInfo: AddedPlayerPacket) {
                if (newPlayerInfo.id === player.getId()) return;
                let newEnemy = new Enemy(newPlayerInfo.id, newPlayerInfo.username);
                enemies.set(newPlayerInfo.id, newEnemy);
                newEnemy.insertInto(camera);
            });

            socket.on('remove_player', function(removedPlayerId: string) {
                let removedEnemy = enemies.get(removedPlayerId);
                if (removedEnemy == null) return;
                removedEnemy.removeFrom(camera);
                enemies.remove(removedEnemy.getId());
            });
        
            socket.on('state', function(state: GameStatePacket) {
                //if (!initalised) return;
                leaderID = state.leader;
                let playerState: PlayerStatePacket = state.player;
                let enemyStates: Array<PlayerStatePacket> = state.enemies || []; 
                let updatedAsteroids: Array<AsteroidStatePacket> = state.asteroids;
        
                //Update player state
                player.updateState(playerState);
                player.setScore(state.score);
                ui.setScore(player.getScore());
        
                //Update enemies state
                for (let i = 0; i < enemyStates.length; i++) {
                    let enemyState = enemyStates[i];
                    let enemy_id = enemyState.id;
                    if (!enemies.has(enemy_id)) continue;
        
                    //FIXME find a better way to deal with dead enemies
                    enemies.get(enemy_id).updateState(enemyState);
                }
        
                //Create/update Asteroids as nessesary
                for (let i = 0; i < updatedAsteroids.length; i++) {
                    let asteroidInfo: AsteroidStatePacket = updatedAsteroids[i];
                    let id: number = asteroidInfo.id;
                    if (asteroids[id] == null) {
                        asteroids[id] = new Asteroid(id%3+1);
                        camera.addChild(asteroids[id].getSprite());
                    }
                    asteroids[id].setState(asteroidInfo);
                }
        
                //Update name of leader (possible bug if lestrinaderID not found?)
                if (player.isAlive()) {
                    if (leaderID === player.getId()) {
                        ui.setLeaderText('You are the leader!');
                    } else {
                        let leader = enemies.get(leaderID);
                        if (leader) ui.setLeaderText('Leader: ' + leader.getUsername());
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

            socket.emit('join', username);
        
        }
        
        function update(delta: number) {
        
            const enemyArray: Array<Enemy> = enemies.values();
            for (let i = 0; i < enemyArray.length; i++) {
                enemyArray[i].update(); // delta
            }
        
            for (let i = 0; i < asteroids.length; i++) {
                if (asteroids[i] == null) continue;
                asteroids[i].update(delta);
            }
        
            if (!player.isAlive()) return;
            for (let i = 0; i < stars.length; i++) {
                stars[i].update();
            }
        
            player.update(delta);
        }
        
        function draw() {
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
        
            if (player.isAlive()) {
                player.draw();
            } else {
                ui.notifyOfDeath();
            }
        
        }
        
        const FPS = 30;
        let lastUpdate = Date.now();
        
        // eslint-disable-next-line no-console
        console.log('Stroids Client v0.4.0');

    }
}

export default Game;