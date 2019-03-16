import Observer from "./Observer";

interface Input {
    W: boolean;
    A: boolean;
    S: boolean;
    D: boolean;
}

class Controls {
    public input: Input;
    protected observer: Observer | null;
    constructor() {
        this.input = {
            'W': false,
            'A': false,
            'S': false,
            'D': false
        };
        this.observer = null;
    }

    setObserver(observer: Observer) {
        this.observer = observer;
    }

    notifyChange() {
        if (this.observer) this.observer.notifyInputChange();
    }

    getW() {
        return this.input.W;
    }
    getA() {
        return this.input.A;
    }
    getS() {
        return this.input.S;
    }
    getD() {
        return this.input.D;
    }


}

export default Controls;
