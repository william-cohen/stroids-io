'use strict';

class Latency {

    constructor(socket) {
        this.socket = socket;
        this.lastDrip = Date.now();
        this.tick = 0;
        this.data = [];
        this.count = 0;
        this.currentLatency = 0;
    }

    static init(socket) {
        return new Latency(socket);
    }

    getMean() {
        if (this.data.length == 0) return -1;
        let mean = 0;
        for (let i = 0; i < this.data.length; i++) {
            mean += this.data[i];
        }

        mean /= this.data.length;

        return mean;
    }

    getSd(mean) {
        if (this.data.length == 0) return -1;

        let variance = 0;

        for (let i = 0; i < this.data.length; i++) {
            variance += this.data[i]*this.data[i];
        }

        variance -= mean*mean;

        return Math.sqrt(variance);
    }



    calc() {
        this.count %= 10;
        let lag = (Date.now() - this.lastDrip)/2;
        let mean = this.getMean();
        let sd = this.getSd(mean);

        if (this.data.length < 10 || Math.abs(mean - lag) < 2*sd) {
            this.data[this.count++] = lag;
        }
    }

    update() {
        if (this.tick == 1) {
            this.socket.emit('drip');
            this.lastDrip = Date.now();
        } else if(this.tick == 2) {
            this.currentLatency = Math.round(this.getMean());
        }

        this.tick++;
        this.tick %= 30;
    }
}

module.exports = Latency;
