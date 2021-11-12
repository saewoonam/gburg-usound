import SocketBase from './socketBase';
import { IEndpoint, Msg } from './types';
export default class Push extends SocketBase {
    private loadBalancer;
    private pending;
    protected attachEndpoint(endpoint: IEndpoint): void;
    protected endpointTerminated(endpoint: IEndpoint): void;
    protected xsend(msg: Msg): void;
}
//# sourceMappingURL=push.d.ts.map