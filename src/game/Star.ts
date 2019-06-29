import Player from './Player';
import { Graphics } from "pixi.js";

class Star {

    private static maxX: number;
    private static maxY: number;
    public static setMaxBounds(x: number, y: number) {
        Star.maxX = x;
        Star.maxY = y;
    }

    private x: number;
    private y: number;
    private player: Player;
    private size: number;
    constructor(size: number, player: Player) {
        this.x = Math.random() * Star.maxX;
        this.y = Math.random() * Star.maxY;
        this.player = player;
        this.size = size;
    }

    update() {
        if (this.x < 0) this.x += Star.maxX;
        if (this.x > Star.maxX) this.x -= Star.maxX;
        if (this.y < 0) this.y += Star.maxY;
        if (this.y > Star.maxY) this.y -= Star.maxY;

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
        g.drawRect(this.x, this.y, this.size, this.size);
    }
}

export default Star;
