import Observer from "./Observer";

class Controls {
    public input: Array<boolean>;
    protected observer: Observer | null;
    constructor() {
        this.input = [false, false, false, false];
        this.observer = null;
    }

    setObserver(observer: Observer) {
        this.observer = observer;
    }

    notifyChange() {
        if (this.observer) this.observer.notifyInputChange();
    }

    getW() {
        return this.input[0];
    }
    getA() {
        return this.input[1];
    }
    getS() {
        return this.input[2];
    }
    getD() {
        return this.input[3];
    }


}

export default Controls;
