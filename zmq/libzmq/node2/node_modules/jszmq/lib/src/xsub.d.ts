/// <reference types="node" />
import SocketBase from './socketBase';
import { IEndpoint, Msg } from './types';
import Trie from './utils/trie';
import Distribution from './utils/distribution';
export default class XSub extends SocketBase {
    subscriptions: Trie;
    distribution: Distribution;
    constructor();
    protected attachEndpoint(endpoint: IEndpoint): void;
    protected hiccuped(endpoint: IEndpoint): void;
    protected endpointTerminated(endpoint: IEndpoint): void;
    protected xrecv(endpoint: IEndpoint, ...frames: Buffer[]): void;
    protected xsend(msg: Msg): void;
}
//# sourceMappingURL=xsub.d.ts.map