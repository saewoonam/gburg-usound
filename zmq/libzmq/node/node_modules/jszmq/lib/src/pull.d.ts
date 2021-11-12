/// <reference types="node" />
import SocketBase from './socketBase';
import { IEndpoint } from './types';
export default class Pull extends SocketBase {
    protected attachEndpoint(endpoint: IEndpoint): void;
    protected endpointTerminated(endpoint: IEndpoint): void;
    protected xrecv(endpoint: IEndpoint, ...frames: Buffer[]): void;
}
//# sourceMappingURL=pull.d.ts.map