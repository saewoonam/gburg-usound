import XSub from './xsub';
import { Frame, Msg } from './types';
export default class Sub extends XSub {
    subscribe(topic: Frame): void;
    unsubscribe(topic: Frame): void;
    xsend(msg: Msg): void;
}
//# sourceMappingURL=sub.d.ts.map