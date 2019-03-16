class Latency {

    private socket: SocketIOClient.Socket;
    private currentLatency: number;

    constructor(socket: SocketIOClient.Socket) {
        this.socket = socket;
        this.currentLatency = 0;
    }

    static init(socket: SocketIOClient.Socket) {
        return new Latency(socket);
    }

    calc(ms: number) {
        this.currentLatency = ms;
    }

}

export default Latency;
