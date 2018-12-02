'use strict';

const Controls = require('./Controls');

class KeyboardControls extends Controls {
    constructor() {
        super();
        document.addEventListener('keydown', this.keydown.bind(this));
        document.addEventListener('keyup', this.keyup.bind(this));
    }

    keydown(e) {
        switch(e.keyCode) {
            case 37:
                this.input.A = true;
                break;
            case 38:
                this.input.W = true;
                break;
            case 39:
                this.input.D = true;
                break;
        }
    }

    keyup(e) {
        switch(e.keyCode) {
            case 37:
                this.input.A = false;
                break;
            case 38:
                this.input.W = false;
                break;
            case 39:
                this.input.D = false;
                break;
        }
    }
}

module.exports = KeyboardControls;
