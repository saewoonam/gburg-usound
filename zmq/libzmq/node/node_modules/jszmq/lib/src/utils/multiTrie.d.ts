/// <reference types="node" />
import { IEndpoint } from '../types';
declare type RemovedCallback = (endpoint: IEndpoint, buffer: Buffer, bufferSize: number) => void;
declare type MatchCallback = (endpoint: IEndpoint) => void;
export default class MultiTrie {
    endpoints?: Set<IEndpoint>;
    minCharacter: number;
    count: number;
    liveNodes: number;
    next: Array<MultiTrie | null>;
    constructor();
    readonly isRedundant: boolean;
    add(prefix: Buffer, start: number, size: number, endpoint: IEndpoint): boolean;
    private addHelper;
    removeEndpoint(endpoint: IEndpoint, func: RemovedCallback): boolean;
    private removeEndpointHelper;
    remove(prefix: Buffer, start: number, size: number, endpoint: IEndpoint): boolean;
    match(data: Buffer, offset: number, size: number, func: MatchCallback): void;
}
export {};
//# sourceMappingURL=multiTrie.d.ts.map