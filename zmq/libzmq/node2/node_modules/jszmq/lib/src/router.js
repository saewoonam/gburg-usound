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
var lodash_1 = require("lodash");
var Router = /** @class */ (function (_super) {
    __extends(Router, _super);
    function Router() {
        var _this = _super.call(this) || this;
        _this.anonymousPipes = [];
        _this.pipes = new Map();
        _this.nextId = 0;
        _this.options.recvRoutingId = true;
        return _this;
    }
    Router.prototype.attachEndpoint = function (endpoint) {
        this.anonymousPipes.push(endpoint);
    };
    Router.prototype.endpointTerminated = function (endpoint) {
        this.pipes.delete(endpoint.routingKeyString);
        lodash_1.pull(this.anonymousPipes, endpoint);
    };
    Router.prototype.xrecv = function (endpoint) {
        var msg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            msg[_i - 1] = arguments[_i];
        }
        // For anonymous pipe, the first message is the identity
        if (lodash_1.includes(this.anonymousPipes, endpoint)) {
            lodash_1.pull(this.anonymousPipes, endpoint);
            var routingKey = msg[0];
            if (routingKey.length > 0)
                endpoint.routingKey = buffer_1.Buffer.concat([new Uint8Array([0]), routingKey]);
            else {
                var buffer = buffer_1.Buffer.alloc(5);
                buffer.writeUInt8(1, 0);
                buffer.writeInt32BE(this.nextId, 1);
                endpoint.routingKey = buffer;
                this.nextId++;
            }
            endpoint.routingKeyString = endpoint.routingKey.toString('hex');
            this.pipes.set(endpoint.routingKeyString, endpoint);
            return;
        }
        this.xxrecv.apply(this, [endpoint, endpoint.routingKey].concat(msg));
    };
    Router.prototype.xxrecv = function (endpoint) {
        var msg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            msg[_i - 1] = arguments[_i];
        }
        this.emit.apply(this, ['message'].concat(msg));
    };
    Router.prototype.xsend = function (msg) {
        if (msg.length <= 1)
            throw new Error('router message must include a routing key');
        var routingKey = msg.shift();
        if (!buffer_1.Buffer.isBuffer(routingKey))
            throw new Error('routing key must be a buffer');
        var endpoint = this.pipes.get(routingKey.toString('hex'));
        if (!endpoint)
            return; // TODO: use mandatory option, if true throw exception here
        endpoint.send(msg);
    };
    return Router;
}(socketBase_1.default));
exports.default = Router;
//# sourceMappingURL=router.js.map