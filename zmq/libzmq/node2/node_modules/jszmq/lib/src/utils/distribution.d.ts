import { IEndpoint, Msg } from '../types';
export default class Distribution {
    endpoints: IEndpoint[];
    matching: number;
    active: number;
    attach(endpoint: IEndpoint): void;
    match(endpoint: IEndpoint): void;
    unmatch(): void;
    terminated(endpoint: IEndpoint): void;
    activated(endpoint: IEndpoint): void;
    sendToAll(msg: Msg): void;
    sendToMatching(msg: Msg): void;
    write(endpoint: IEndpoint, msg: Msg): boolean;
}
//# sourceMappingURL=distribution.d.ts.map