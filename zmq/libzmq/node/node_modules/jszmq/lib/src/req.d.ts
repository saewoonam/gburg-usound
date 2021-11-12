/// <reference types="node" />
import Dealer from './dealer';
import { IEndpoint, Msg } from './types';
export default class Req extends Dealer {
    private static bottom;
    receivingReply: boolean;
    constructor();
    protected xsend(msg: Msg): void;
    protected xrecv(endpoint: IEndpoint, bottom: Buffer, ...frames: Buffer[]): void;
}
//# sourceMappingURL=req.d.ts.map