import Controls from './Controls';

class KeyboardControls extends Controls {
    constructor() {
        super();
        document.addEventListener('keydown', this.keydown.bind(this));
        document.addEventListener('keyup', this.keyup.bind(this));
    }

    keydown(e: KeyboardEvent) {
        if (e.repeat) return;
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
        default:
            break;
        }
        super.notifyChange();
    }

    keyup(e: KeyboardEvent) {
        if (e.repeat) return;
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
        default:
            break;
        }
        super.notifyChange();
    }
}

export default KeyboardControls;
