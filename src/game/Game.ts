/* global process, window, document, require, prompt */
import { Application, Graphics, loader } from 'pixi.js';
import Viewport from 'pixi-viewport';
import IsMobile from 'is-mobile';
import io from 'socket.io-client';
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
import { GameStatePacket, PlayerStatePacket, AsteroidStatePacket, PlayerInfoPacket, InitialStatePakcet } from './NetworkPackets';
import Entity from './Entity';
import { ENGINE_METHOD_PKEY_ASN1_METHS } from 'constants';

//@ts-ignore: no compatible call siganatures
const IS_MOBILE: boolean = IsMobile();
const CONNECTION: string = "127.0.0.1:3001"; //process.env.SERVER_URL;
const GAME_SIZE: number = 10000;
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
            worldWidth: GAME_SIZE,
            worldHeight: GAME_SIZE
        });
        
        const gui = new Viewport({
            screenWidth: CANVAS_WIDTH,
            screenHeight: CANVAS_HEIGHT,
            worldWidth: GAME_SIZE,
            worldHeight: GAME_SIZE
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
        //if (IS_MOBILE)
            camera
                .drag()
                .pinch()
                .wheel()
                .decelerate();
        
        const graphics = new Graphics();
        
        let player: Player;
        // let playerStub = null;
        // let stubGraphics = new PIXI.Graphics();
        
        let entities: Map<string | number, Entity>;
        let leaderInfo: PlayerInfoPacket = {id: '', username: ''};
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
        
            entities = new Map<number | string, Entity>();

            Star.setMaxBounds(GAME_SIZE, GAME_SIZE);
            Star.setScreenBounds(1000, 1000);
            stars = [];
            const NUM_STARS = Math.round(CANVAS_WIDTH * CANVAS_HEIGHT * 0.000045);
            for (var i = 0; i < NUM_STARS; i++) {
                stars.push(new Star(3, player));
                stars.push(new Star(2, player));
                stars.push(new Star(1, player));
            }

            //Ping event listener
            socket.on('pong', function(ms: number) {
                Ping.calc(ms);
                ui.setPing(ms);
            });
        
            socket.on('message', function(text: string) {
                //TODO make the message show properly
                // eslint-disable-next-line no-console
                console.log('Message: ' + text);
            });
        
            socket.on('state', function(state: GameStatePacket) {
                //if (!initalised) return;
                leaderInfo.id = state.leader;
                let playerState: PlayerStatePacket = state.player;
                let enemyStates: Array<PlayerStatePacket> = state.enemies; 
                let asteroidStates: Array<AsteroidStatePacket> = state.asteroids;
        
                //Update player state
                player.updateState(playerState);
                player.setScore(state.score);
                 console.log(state);
                ui.setScore(player.getScore());
        
                //Update enemies state
                for (let i = 0; i < enemyStates.length; i++) {
                    let enemyState = enemyStates[i];
                    let enemyId = enemyState.id;
                    if (!entities.has(enemyId)) {
                        let enemyName = enemyState.name;
                        let newEnemy = new Enemy(enemyId, enemyName);
                        entities.set(enemyId, newEnemy);
                        newEnemy.insertInto(camera);
                    }
                    entities.get(enemyId)!.updateState(enemyState);
                }
        
                //Create/update Asteroids as nessesary
                for (let i = 0; i < asteroidStates.length; i++) {
                    let asteroidInfo: AsteroidStatePacket = asteroidStates[i];
                    let id: number = asteroidInfo.id;
                    if (!entities.has(id)) {
                        let newAsteroid = new Asteroid(id);
                        console.log(newAsteroid)
                        entities.set(id, newAsteroid);
                        newAsteroid.insertInto(camera);
                    }
                    entities.get(id)!.updateState(asteroidInfo);
                }
        
                //Update name of leader (possible bug if lestrinaderID not found?)
                if (player.isAlive()) {
                    if (leaderInfo.id === player.getId()) {
                        ui.setLeaderText('You are the leader!');
                    } else {
                        ui.setLeaderText('Leader: ' + leaderInfo.username);
                        if (leaderInfo.username === '')
                            socket.emit('nameOf', leaderInfo.id);
                    }
                }
        
            });

            socket.on('nameIs', function(info: PlayerInfoPacket) {
                let enemy = entities.get(info.id);
                if (enemy) (enemy as Enemy).setUsername(info.username);
                if (leaderInfo.id === info.id) leaderInfo.username = info.username;
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
            for (let entity of entities.values()) {
                entity.update(delta);
                if (entity.getLifespan() < 0) {
                    entity.removeFrom(camera);
                    entities.delete(entity.getId());
                }
                if (entity instanceof Enemy) {
                    let enemy = (entity as Enemy);
                    if (!enemy.getUsername()) 
                        socket.emit('nameOf', enemy.getId())
                }
            }
            //if (!player.isAlive()) debugger; //return;
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
        
            for (let entity of entities.values()) {
                entity.draw();
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
        console.log('Stroids Client v0.4.5');

    }
}

export default Game;