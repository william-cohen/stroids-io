import * as PIXI from 'pixi.js';
import Vector2 from '../util/Vector2';
import Observer from './controls/Observer';
import Controls from './controls/Controls';
import { PlayerStatePacket } from './NetworkPackets';

class Player extends Observer {
    private id: string;
    private username: string;
    private pos: Vector2;
    private vel: Vector2;
    private spos: Vector2;
    private svel: Vector2;
    private rotation: number;
    private srotation: number;
    private sprite: PIXI.extras.AnimatedSprite;
    private thrust: boolean;

    private alive: boolean;
    private tick: number;
    private socket: SocketIOClient.Socket;
    private controller: Controls;

    private score: number;

    constructor(socket: SocketIOClient.Socket, username: string, controller: Controls) {
        super();
        this.username = username;
        this.tick = 0;
        this.score = 0;
        this.socket = socket;
        this.id = 'null';

        this.controller = controller;

        this.alive = true;
        this.thrust = false;

        this.pos = new Vector2(0.0, 0.0);
        this.vel = new Vector2(0.0, 0.0);

        this.spos = new Vector2(0.0, 0.0);
        this.svel = new Vector2(0.0, 0.0);

        this.rotation = 0.0;
        this.srotation = 0.0;

        let frames: Array<PIXI.Texture> = [
            //@ts-ignore: Object is possibly 'undefined'
            PIXI.loader.resources['assets/spritesheet.json'].textures['player.png'],
            //@ts-ignore: Object is possibly 'undefined'
            PIXI.loader.resources['assets/spritesheet.json'].textures['playerT.png'],
            //@ts-ignore: Object is possibly 'undefined'
            PIXI.loader.resources['assets/spritesheet.json'].textures['playerT2.png']
        ];
        this.sprite = new PIXI.extras.AnimatedSprite(frames);
        this.sprite.anchor.set(0.5);
        this.sprite.animationSpeed = 0.2;
        this.sprite.onLoop = () => {
            this.sprite.gotoAndPlay(1);
        };
        this.sprite.play();
    }

    notifyInputChange() {
        //FIXME
        //console.log('Input changed!');
        this.socket.emit('input', this.controller.input);
    }

    updateState(state: PlayerStatePacket) {
        if (this.id === 'null') {
            this.pos.x = state.x;
            this.pos.y = state.y;
            //this.rotation = state.rotation;
        }
        this.id = state.id;
        this.spos.x = state.x;
        this.spos.y = state.y;
        this.svel.x = state.vx;
        this.svel.y = state.vy;
        this.rotation = state.rotation; //srotation
        this.alive = state.alive;

        //XXX
        if (!this.alive) this.sprite.visible = false;
    }

    setScore(score: number) {
        this.score = score;
    }

    getScore() {
        return this.score;
    }

    getId() {
        return this.id;
    }

    getVX(): number {
        return this.vel.x;
    }

    getVY(): number {
        return this.vel.y;
    }

    update(delta: number) {
        let thrust = new Vector2(0,0);
        this.tick++; this.tick %= 30;
        if (this.alive) {
            this.thrust = false;

            this.tick++;
            this.tick %= 30;

            //Left Arrow Key
            if (this.controller.getA()) {
                this.rotation -= 3.0 * delta;
            }
            //Right Arrow Key
            if (this.controller.getD()) {
                this.rotation += 3.0 * delta;
            }
            //Up Arrow Key
            if (this.controller.getW()) {
                this.thrust = true;
                thrust.x = 30.0 * Math.cos(this.rotation);
                thrust.y = 30.0 * Math.sin(this.rotation);
            }
            // this.socket.emit('input', this.controller.input);
        }

        this.spos = this.spos.add(this.svel.scale(delta));

        //let angleDelta = Util.angleDelta(this.rotation, this.srotation);

        let offset = this.spos.subtract(this.pos);

        //Need to investigate better rubber-banding methods with more math
        //Also might be worth delegating to GPU (somehow)
        let fnet = thrust.subtract(
            this.vel.scale(1.75).subtract(offset.scale(0.015*offset.mag()))
        );

        this.vel = this.vel.add(fnet.scale(delta));
        this.pos = this.pos.add(this.vel);
    }

    draw() {
        if (!this.alive) return;
        if (!this.thrust) {
            this.sprite.gotoAndStop(0);
        } else {
            this.sprite.play();
        }
        this.sprite.x = this.pos.x;
        this.sprite.y = this.pos.y;

        this.sprite.rotation = this.rotation + Math.PI/2;
    }

    insertInto(camera: Viewport) {
        camera.addChild(this.sprite);
        camera.follow(this.sprite);
    }

    removeFrom(camera: Viewport) {
        camera.removeChild(this.sprite);
    }

    isAlive() {
        return this.alive;
    }
}

export default Player;
