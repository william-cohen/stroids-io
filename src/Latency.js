class Latency {

    constructor(socket) {
        this.socket = socket;
        this.currentLatency = 0;
    }

    static init(socket) {
        return new Latency(socket);
    }

    calc(ms) {
        this.currentLatency = ms;
    }

}

module.exports = Latency;
