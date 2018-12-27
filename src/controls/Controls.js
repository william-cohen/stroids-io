'use strict';

class Controls {
    constructor() {
        this.input = {
            'W' : false,
            'A' : false,
            'S' : false,
            'D' : false
        };
    }

    setObserver(observer) {
        this.observer = observer;
    }

    notifyChange() {
        this.observer.notifyInputChange();
    }

}

module.exports = Controls;
