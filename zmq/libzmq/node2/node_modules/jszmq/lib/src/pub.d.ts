/// <reference types="node" />
import XPub from './xpub';
import { IEndpoint } from './types';
export default class Pub extends XPub {
    protected xxrecv(endpoint: IEndpoint, ...frames: Buffer[]): void;
    protected sendUnsubscription(): void;
}
//# sourceMappingURL=pub.d.ts.map