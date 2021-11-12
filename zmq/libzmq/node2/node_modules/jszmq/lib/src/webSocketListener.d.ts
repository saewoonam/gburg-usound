/// <reference types="ws" />
/// <reference types="node" />
import WebSocket = require('isomorphic-ws');
import EventEmitter = require('events');
import SocketOptions from './socketOptions';
import * as http from 'http';
import * as https from 'https';
import { IListener } from './types';
declare type HttpServer = http.Server | https.Server;
export default class WebSocketListener extends EventEmitter implements IListener {
    address: string;
    private httpServer;
    private options;
    server: WebSocket.Server;
    path: string | undefined;
    constructor(address: string, httpServer: HttpServer | undefined, options: SocketOptions);
    onConnection(connection: WebSocket): void;
    close(): void;
}
export {};
//# sourceMappingURL=webSocketListener.d.ts.map