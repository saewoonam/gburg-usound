/// <reference types="node" />
declare type ForeachCallback = (buffer: Buffer) => void;
export default class Trie {
    referenceCount: number;
    minCharacter: number;
    count: number;
    liveNodes: number;
    next: Array<Trie | null>;
    constructor();
    readonly isRedundant: boolean;
    add(prefix: Buffer, start: number, size: number): boolean;
    remove(prefix: Buffer, start: number, size: number): boolean;
    check(data: Buffer, offset: number, size: number): boolean;
    forEach(func: ForeachCallback): void;
    forEachHelper(buffer: Buffer, bufferSize: number, maxBufferSize: number, func: ForeachCallback): void;
}
export {};
//# sourceMappingURL=trie.d.ts.map