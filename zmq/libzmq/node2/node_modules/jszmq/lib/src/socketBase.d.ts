/// <reference types="node" />
import EventEmitter = require('events');
import SocketOptions from './socketOptions';
import { Frame, IEndpoint, Msg } from './types';
import * as http from 'http';
import * as https from 'https';
declare class SocketBase extends EventEmitter {
    private endpoints;
    private binds;
    readonly options: SocketOptions;
    constructor();
    connect(address: string): void;
    disconnect(address: string): void;
    bind(address: string, server?: http.Server | https.Server): void;
    bindSync(address: string, server?: http.Server | https.Server): void;
    unbind(address: string): void;
    close(): void;
    subscribe(topic: Frame): void;
    unsubscribe(topic: Frame): void;
    private bindAttachEndpoint;
    private bindEndpointTerminated;
    protected attachEndpoint(endpoint: IEndpoint): void;
    protected endpointTerminated(endpoint: IEndpoint): void;
    protected hiccuped(endpoint: IEndpoint): void;
    protected xrecv(endpoint: IEndpoint, ...frames: Buffer[]): void;
    protected xsend(msg: Msg): void;
    send(msg: Msg | Frame): void;
}
export default SocketBase;
//# sourceMappingURL=socketBase.d.ts.map