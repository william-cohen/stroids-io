import PIXI from 'pixi.js';
import Controls from './Controls';

class MobileControls extends Controls {
    constructor(canvasWidth, canvasHeight) {
        super();

        this.upButton = new PIXI.Text(
            '<',
            new PIXI.TextStyle({
                fontFamily: 'Press Start 2P',
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
            this.input.W = true;
            super.notifyChange();
        });
        this.upButton.on('pointerup', (event) => {
            this.upButton.style.fill = 'white';
            this.input.W = false;
            super.notifyChange();
        });

        this.leftButton = new PIXI.Text(
            '<',
            new PIXI.TextStyle({
                fontFamily: 'Press Start 2P',
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
            this.input.A = true;
            super.notifyChange();
        });
        this.leftButton.on('pointerup', (event) => {
            this.leftButton.style.fill = 'white';
            this.input.A = false;
            super.notifyChange();
        });

        this.rightButton = new PIXI.Text(
            '>',
            new PIXI.TextStyle({
                fontFamily: 'Press Start 2P',
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
            this.input.D = true;
            super.notifyChange();
        });
        this.rightButton.on('pointerup', (event) => {
            this.rightButton.style.fill = 'white';
            this.input.D = false;
            super.notifyChange();
        });
    }

    insertInto(view) {
        view.addChild(this.upButton);
        view.addChild(this.leftButton);
        view.addChild(this.rightButton);
    }
}

export default MobileControls;
