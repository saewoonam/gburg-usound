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
var multiTrie_1 = require("./utils/multiTrie");
var distribution_1 = require("./utils/distribution");
var XPub = /** @class */ (function (_super) {
    __extends(XPub, _super);
    function XPub() {
        var _this = _super.call(this) || this;
        _this.subscriptions = new multiTrie_1.default();
        _this.distribution = new distribution_1.default();
        _this.markAsMatching = _this.markAsMatching.bind(_this);
        _this.sendUnsubscription = _this.sendUnsubscription.bind(_this);
        return _this;
    }
    XPub.prototype.markAsMatching = function (endpoint) {
        this.distribution.match(endpoint);
    };
    XPub.prototype.sendUnsubscription = function (endpoint, data, size) {
        var unsubscription = buffer_1.Buffer.concat([buffer_1.Buffer.from([0]), data.slice(0, size)]);
        endpoint.send([unsubscription]);
    };
    XPub.prototype.attachEndpoint = function (endpoint) {
        this.distribution.attach(endpoint);
    };
    XPub.prototype.endpointTerminated = function (endpoint) {
        this.subscriptions.removeEndpoint(endpoint, this.sendUnsubscription);
        this.distribution.terminated(endpoint);
    };
    XPub.prototype.xsend = function (msg) {
        var topic;
        if (buffer_1.Buffer.isBuffer(msg[0])) {
            // @ts-ignore
            topic = msg[0];
        }
        else {
            // @ts-ignore
            topic = buffer_1.Buffer.from(msg[0], 'utf8');
        }
        this.subscriptions.match(topic, 0, topic.length, this.markAsMatching);
        this.distribution.sendToMatching(msg);
    };
    XPub.prototype.xrecv = function (endpoint, subscription) {
        var frames = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            frames[_i - 2] = arguments[_i];
        }
        if (subscription.length > 0) {
            var type = subscription.readUInt8(0);
            if (type === 0 || type === 1) {
                var unique = void 0;
                if (type === 0)
                    unique = this.subscriptions.remove(subscription, 1, subscription.length - 1, endpoint);
                else
                    unique = this.subscriptions.add(subscription, 1, subscription.length - 1, endpoint);
                if (unique || this.options.xpubVerbose)
                    this.xxrecv.apply(this, [endpoint, subscription].concat(frames));
                return;
            }
        }
        this.xxrecv.apply(this, [endpoint, subscription].concat(frames));
    };
    XPub.prototype.xxrecv = function (endpoint) {
        var frames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            frames[_i - 1] = arguments[_i];
        }
        this.emit.apply(this, ['message'].concat(frames));
    };
    return XPub;
}(socketBase_1.default));
exports.default = XPub;
//# sourceMappingURL=xpub.js.map