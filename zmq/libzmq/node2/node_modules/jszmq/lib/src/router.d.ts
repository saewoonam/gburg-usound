/// <reference types="node" />
import SocketBase from './socketBase';
import { IEndpoint, Msg } from './types';
export default class Router extends SocketBase {
    anonymousPipes: IEndpoint[];
    pipes: Map<string, IEndpoint>;
    nextId: number;
    constructor();
    protected attachEndpoint(endpoint: IEndpoint): void;
    protected endpointTerminated(endpoint: IEndpoint): void;
    protected xrecv(endpoint: IEndpoint, ...msg: Buffer[]): void;
    protected xxrecv(endpoint: IEndpoint, ...msg: Buffer[]): void;
    protected xsend(msg: Msg): void;
}
//# sourceMappingURL=router.d.ts.map