"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_1 = require("buffer");
var lodash_1 = require("lodash");
var xsub_1 = require("./xsub");
var Sub = /** @class */ (function (_super) {
    __extends(Sub, _super);
    function Sub() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Sub.prototype.subscribe = function (topic) {
        if (lodash_1.isString(topic)) {
            var frame = buffer_1.Buffer.concat([buffer_1.Buffer.from([1]), buffer_1.Buffer.from(topic)]);
            _super.prototype.xsend.call(this, [frame]);
        }
        else if (buffer_1.Buffer.isBuffer(topic)) {
            var frame = buffer_1.Buffer.concat([buffer_1.Buffer.from([1]), topic]);
            _super.prototype.xsend.call(this, [frame]);
        }
        else
            throw new Error('unsupported topic type');
    };
    Sub.prototype.unsubscribe = function (topic) {
        if (lodash_1.isString(topic)) {
            var frame = buffer_1.Buffer.concat([buffer_1.Buffer.from([0]), buffer_1.Buffer.from(topic)]);
            _super.prototype.xsend.call(this, [frame]);
        }
        else if (buffer_1.Buffer.isBuffer(topic)) {
            var frame = buffer_1.Buffer.concat([buffer_1.Buffer.from([0]), topic]);
            _super.prototype.xsend.call(this, [frame]);
        }
        else
            throw new Error('unsupported topic type');
    };
    Sub.prototype.xsend = function (msg) {
        throw new Error('not supported');
    };
    return Sub;
}(xsub_1.default));
exports.default = Sub;
//# sourceMappingURL=sub.js.map