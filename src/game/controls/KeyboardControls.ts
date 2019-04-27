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
            this.input[1] = true;
            break;
        case 38:
            this.input[0] = true;
            break;
        case 39:
            this.input[3] = true;
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
            this.input[1] = false;
            break;
        case 38:
            this.input[0] = false;
            break;
        case 39:
            this.input[3] = false;
            break;
        default:
            break;
        }
        super.notifyChange();
    }
}

export default KeyboardControls;
