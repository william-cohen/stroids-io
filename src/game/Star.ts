import Player from './Player';
import { Graphics } from "pixi.js";

class Star {
    private static maxX: number;
    private static maxY: number;
    private static screenMaxX: number;
    private static screenMaxY: number;

    public static setMaxBounds(x: number, y: number): void {
        Star.maxX = x;
        Star.maxY = y;
    }

    public static setScreenBounds(x: number, y: number): void {
        Star.screenMaxX = x;
        Star.screenMaxY = y;
    }

    private x: number;
    private y: number;
    private player: Player;
    private size: number;
    private visible: boolean;
    constructor(size: number, player: Player) {
        this.x = Math.random() * Star.maxX;
        this.y = Math.random() * Star.maxY;
        this.player = player;
        this.size = size;
        this.visible = true;
    }

    update() {
        this.visible = true; 

        const dx = this.x - this.player.getX();
        const dy = this.y - this.player.getY();

        if (dx < -Star.screenMaxX/2) this.x += Star.screenMaxX;
        if (dx > Star.screenMaxX/2) this.x -= Star.screenMaxX;
        if (dy < -Star.screenMaxX/2) this.y += Star.screenMaxY;
        if (dy > Star.screenMaxX/2) this.y -= Star.screenMaxY;

        if (this.x < 0) this.visible = false;
        if (this.x > Star.maxX) this.visible = false;
        if (this.y < 0) this.visible = false;
        if (this.y > Star.maxY) this.visible = false;

        switch (this.size) {
        case 1:
            this.x += 0.5 * this.player.getVX();
            this.y += 0.5 * this.player.getVY();
            break;
        case 2:
            this.x += 0.5 * 0.66 * this.player.getVX();
            this.y += 0.5 * 0.66 * this.player.getVY();
            break;
        case 3:
            this.x += 0.5 * 0.33 * this.player.getVX();
            this.y += 0.5 * 0.33 * this.player.getVY();
            break;
        default:
            break;
        }
    }

    draw(g: Graphics) {
        if (!this.visible) return;
        g.drawRect(this.x, this.y, this.size, this.size);
    }
}

export default Star;
