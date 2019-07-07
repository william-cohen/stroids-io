import * as PIXI from 'pixi.js';
import Vector2 from '../util/Vector2';
import hspline from '../util/HermiteSpline';
import Util from '../util/Util';
import { PlayerStatePacket } from './NetworkPackets';
import Entity from './Entity';

class Enemy extends Entity {

    private static NameStyle = new PIXI.TextStyle({
        fontFamily: 'RetroComputer',
        fontSize: 8,
        fill: 'white',
        align: 'center'
    });

    protected id: string;
    private username: string;
    private rotation: number;
    private oldPos: Vector2;
    private oldVel: Vector2;
    private oldRotation: number;
    private lerp_t: number;
    private sprite: PIXI.extras.AnimatedSprite;
    private thrust: boolean;
    private alive: boolean;
    private nametag: PIXI.Text;

    constructor(id: string, username: string) {
        super(id);
        this.id = id;
        this.username = username;
 
        this.pos = new Vector2(0.0, 0.0);
        this.vel = new Vector2(0.0, 0.0);
        this.rotation = 0.0;
        this.oldPos = new Vector2(0.0, 0.0);
        this.oldVel = new Vector2(0.0, 0.0);
        this.oldRotation = 0.0;
        this.lerp_t = 0;
        
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
        this.thrust = false;
        this.alive = true;

        this.nametag = new PIXI.Text(
            this.username,
            Enemy.NameStyle
        );
        this.nametag.anchor.set(0.5);
    }

    getId(): string {
        return this.id;
    }

    getUsername(): string {
        return this.username;
    }

    insertInto(camera: Viewport) {
        camera.addChild(this.sprite);
        camera.addChild(this.nametag);
    }

    removeFrom(camera: Viewport) {
        camera.removeChild(this.sprite);
        camera.removeChild(this.nametag);
    }

    updateState(state: PlayerStatePacket) {
        this.lifespan = Entity.DEFAULT_LIFESPAN;

        this.oldPos = this.pos.clone();
        this.oldVel = this.vel.clone();
        this.oldRotation = this.rotation;
        this.lerp_t = 0;

        this.pos.x = state.x;
        this.pos.y = state.y;
        this.vel.x = state.vx;
        this.vel.y = state.vy;

        this.rotation = state.rotation;
        this.thrust = state.thrust;
        this.alive = state.alive;
    }

    update(delta: number) {
        if (!this.alive) return;
        this.lifespan -= delta;

        //this.pos.x += this.vel.x*delta;
        //this.pos.y += this.vel.y*delta;
    }

    draw() {
        if (!this.alive) return;

        //XXX Assumed network tickrate of 6Hz
        this.lerp_t += 1.0/6.0;

        //Hermite Spline interpolation (very smooth)
        let p = hspline(this.oldPos, this.oldVel, this.pos, this.vel, this.lerp_t);
        let angleDelta = Util.angleDelta(this.rotation, this.oldRotation);
        //Linear angle interpolation
        let angle = this.oldRotation + angleDelta*this.lerp_t;

        if (!this.thrust) {
            this.sprite.gotoAndStop(0);
        } else {
            this.sprite.play();
        }
        this.sprite.x = p.x;
        this.sprite.y = p.y;

        this.sprite.rotation = angle + Math.PI/2;

        this.nametag.position.set(p.x, p.y + 30);
    }

}

export default Enemy;
