/// <reference types="node" />
import Router from './router';
import { IEndpoint, Msg } from './types';
declare type PendingMsg = [IEndpoint, Buffer[]];
export default class Rep extends Router {
    private static bottom;
    sendingReply: boolean;
    ids: Buffer[];
    pending: PendingMsg[];
    constructor();
    protected xsend(msg: Msg): void;
    private recvInternal;
    protected xxrecv(endpoint: IEndpoint, ...frames: Buffer[]): void;
}
export {};
//# sourceMappingURL=rep.d.ts.map