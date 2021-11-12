/// <reference types="node" />
import SocketBase from './socketBase';
import { IEndpoint, Msg } from './types';
export default class Pair extends SocketBase {
    private endpoint?;
    private pending;
    protected attachEndpoint(endpoint: IEndpoint): void;
    protected endpointTerminated(endpoint: IEndpoint): void;
    protected xrecv(endpoint: IEndpoint, ...frames: Buffer[]): void;
    protected xsend(msg: Msg): void;
}
//# sourceMappingURL=pair.d.ts.map