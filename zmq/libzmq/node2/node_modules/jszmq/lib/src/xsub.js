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
var socketBase_1 = require("./socketBase");
var trie_1 = require("./utils/trie");
var distribution_1 = require("./utils/distribution");
var XSub = /** @class */ (function (_super) {
    __extends(XSub, _super);
    function XSub() {
        var _this = _super.call(this) || this;
        _this.subscriptions = new trie_1.default();
        _this.distribution = new distribution_1.default();
        return _this;
    }
    XSub.prototype.attachEndpoint = function (endpoint) {
        this.distribution.attach(endpoint);
        this.subscriptions.forEach(function (s) { return endpoint.send([buffer_1.Buffer.concat([new buffer_1.Buffer([1]), s])]); });
    };
    XSub.prototype.hiccuped = function (endpoint) {
        this.subscriptions.forEach(function (s) { return endpoint.send([buffer_1.Buffer.concat([new buffer_1.Buffer([1]), s])]); });
    };
    XSub.prototype.endpointTerminated = function (endpoint) {
        this.distribution.terminated(endpoint);
    };
    XSub.prototype.xrecv = function (endpoint) {
        var frames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            frames[_i - 1] = arguments[_i];
        }
        var topic = frames[0];
        var subscribed = this.subscriptions.check(topic, 0, topic.length);
        if (subscribed)
            this.emit.apply(this, ['message'].concat(frames));
    };
    XSub.prototype.xsend = function (msg) {
        var frame = msg[0];
        if (!buffer_1.Buffer.isBuffer(frame))
            throw new Error("subscription must be a buffer");
        if (frame.length > 0 && frame.readUInt8(0) === 1) {
            this.subscriptions.add(frame, 1, frame.length - 1);
            this.distribution.sendToAll(msg);
        }
        else if (frame.length > 0 && frame.readUInt8(0) === 0) {
            // Removing only one subscriptions
            var removed = this.subscriptions.remove(frame, 1, frame.length - 1);
            if (removed)
                this.distribution.sendToAll(msg);
        }
        else {
            // upstream message unrelated to sub/unsub
            this.distribution.sendToAll(msg);
        }
    };
    return XSub;
}(socketBase_1.default));
exports.default = XSub;
//# sourceMappingURL=xsub.js.map