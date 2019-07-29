import * as SocketIOClient from 'socket.io-client';

interface TimeSyncPacket {
    t0: number;
    t1: number;
}


class TimeSync {
    private static INTERVAL = 1000;
    private static ESTIMATES = 10;

    //private socket: SocketIOClient.Socket;
    private times: number[];
    socket: SocketIOClient.Socket;
    
    constructor(socket: SocketIOClient.Socket) {
        this.socket = socket;
        this.times = [];
        // Bind bullshit ergh
        this.socket.on('ts_1', this.onSync.bind(this));
        setInterval(this.sync.bind(this), TimeSync.INTERVAL);
    }

    sync() {
        let packet = {
            t0: Date.now()
        };
        this.socket.emit('ts_0', packet);
    }

    private onSync(data: TimeSyncPacket) {
        let estTime = data.t1 + ((Date.now() - data.t0)/2);
        this.times.unshift(estTime);
        if (this.times.length > TimeSync.ESTIMATES) this.times.pop();
    }

    public getTime() {
        let currentTime = 0;
        for (let est of this.times) {
            currentTime += est;
        }
        if (currentTime) currentTime /= this.times.length;
        return currentTime;
    }

}

export default TimeSync;