import { Msg, IEndpoint } from '../types';
export default class LoadBalancer {
    endpoints: IEndpoint[];
    current: number;
    attach(endpoint: IEndpoint): void;
    terminated(endpoint: IEndpoint): void;
    send(msg: Msg): boolean;
}
//# sourceMappingURL=loadBalancer.d.ts.map