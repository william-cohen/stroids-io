import * as PIXI from 'pixi.js';
import Controls from './Controls';

class MobileControls extends Controls {
    private upButton: PIXI.Text;
    private leftButton: PIXI.Text;
    private rightButton: PIXI.Text;

    constructor(canvasWidth: number, canvasHeight: number) {
        super();
        this.upButton = new PIXI.Text(
            '<',
            new PIXI.TextStyle({
                fontFamily: 'RetroComputer',
                fontSize: 72,
                fill: 'white',
                align: 'center'
            })
        );
        this.upButton.anchor.set(0.5);
        this.upButton.position.set(7*canvasWidth/8,canvasHeight - 50);
        this.upButton.rotation = Math.PI/2;
        this.upButton.interactive = true;
        this.upButton.on('pointerdown', (event) => {
            this.upButton.style.fill = 'red';
            this.input[0] = true;
            super.notifyChange();
        });
        this.upButton.on('pointerup', (event) => {
            this.upButton.style.fill = 'white';
            this.input[0] = false;
            super.notifyChange();
        });

        this.leftButton = new PIXI.Text(
            '<',
            new PIXI.TextStyle({
                fontFamily: 'RetroComputer',
                fontSize: 72,
                fill: 'white',
                align: 'center'
            })
        );
        this.leftButton.anchor.set(0.5);
        this.leftButton.position.set(1*canvasWidth/8,canvasHeight - 50);
        this.leftButton.interactive = true;
        this.leftButton.on('pointerdown', (event) => {
            this.leftButton.style.fill = 'red';
            this.input[1] = true;
            super.notifyChange();
        });
        this.leftButton.on('pointerup', (event) => {
            this.leftButton.style.fill = 'white';
            this.input[1] = false;
            super.notifyChange();
        });

        this.rightButton = new PIXI.Text(
            '>',
            new PIXI.TextStyle({
                fontFamily: 'RetroComputer',
                fontSize: 72,
                fill: 'white',
                align: 'center'
            })
        );
        this.rightButton.anchor.set(0.5);
        this.rightButton.position.set(4*canvasWidth/8,canvasHeight - 50);
        this.rightButton.interactive = true;
        this.rightButton.on('pointerdown', (event) => {
            this.rightButton.style.fill = 'red';
            this.input[3] = true;
            super.notifyChange();
        });
        this.rightButton.on('pointerup', (event) => {
            this.rightButton.style.fill = 'white';
            this.input[3] = false;
            super.notifyChange();
        });
    }

    insertInto(view: Viewport) {
        view.addChild(this.upButton);
        view.addChild(this.leftButton);
        view.addChild(this.rightButton);
    }
}

export default MobileControls;
