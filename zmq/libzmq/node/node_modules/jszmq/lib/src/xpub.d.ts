/// <reference types="node" />
import SocketBase from './socketBase';
import { IEndpoint, Msg } from './types';
import MultiTrie from './utils/multiTrie';
import Distribution from './utils/distribution';
export default class XPub extends SocketBase {
    subscriptions: MultiTrie;
    distribution: Distribution;
    constructor();
    private markAsMatching;
    protected sendUnsubscription(endpoint: IEndpoint, data: Buffer, size: number): void;
    protected attachEndpoint(endpoint: IEndpoint): void;
    protected endpointTerminated(endpoint: IEndpoint): void;
    protected xsend(msg: Msg): void;
    protected xrecv(endpoint: IEndpoint, subscription: Buffer, ...frames: Buffer[]): void;
    protected xxrecv(endpoint: IEndpoint, ...frames: Buffer[]): void;
}
//# sourceMappingURL=xpub.d.ts.map