/// <reference types="ws" />
/// <reference types="node" />
import EventEmitter = require('events');
import WebSocket = require('isomorphic-ws');
import SocketOptions from './socketOptions';
import { IEndpoint, Msg } from './types';
declare enum State {
    Closed = 0,
    Connecting = 1,
    Reconnecting = 2,
    Active = 3
}
export default class WebSocketEndpoint extends EventEmitter implements IEndpoint {
    socket: WebSocket;
    state: State;
    frames: Buffer[];
    queue: Buffer[];
    options: SocketOptions;
    routingIdReceived: boolean;
    accepted: boolean;
    routingKey: Buffer;
    routingKeyString: string;
    address: string;
    constructor(address: string | WebSocket, options: SocketOptions);
    private connect;
    onOpen(): void;
    onClose(): void;
    error(): void;
    onMessage(message: ArrayBuffer | any): void;
    close(): void;
    send(msg: Msg): boolean;
}
export {};
//# sourceMappingURL=webSocketEndpoint.d.ts.map