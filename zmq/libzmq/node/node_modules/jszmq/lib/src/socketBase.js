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
var EventEmitter = require("events");
var socketOptions_1 = require("./socketOptions");
var lodash_1 = require("lodash");
var webSocketListener_1 = require("./webSocketListener");
var webSocketEndpoint_1 = require("./webSocketEndpoint");
var SocketBase = /** @class */ (function (_super) {
    __extends(SocketBase, _super);
    function SocketBase() {
        var _this = _super.call(this) || this;
        _this.endpoints = [];
        _this.binds = [];
        _this.options = new socketOptions_1.default();
        _this.bindAttachEndpoint = _this.bindAttachEndpoint.bind(_this);
        _this.bindEndpointTerminated = _this.bindEndpointTerminated.bind(_this);
        _this.attachEndpoint = _this.attachEndpoint.bind(_this);
        _this.endpointTerminated = _this.endpointTerminated.bind(_this);
        _this.xrecv = _this.xrecv.bind(_this);
        _this.hiccuped = _this.hiccuped.bind(_this);
        return _this;
    }
    SocketBase.prototype.connect = function (address) {
        if (address.startsWith("ws://") || address.startsWith("wss://")) {
            var endpoint = new webSocketEndpoint_1.default(address, this.options);
            endpoint.on('attach', this.attachEndpoint);
            endpoint.on('terminated', this.endpointTerminated);
            endpoint.on('message', this.xrecv);
            endpoint.on('hiccuped', this.hiccuped);
            this.endpoints.push(endpoint);
            if (!this.options.immediate)
                this.attachEndpoint(endpoint);
        }
        else {
            throw new Error('unsupported transport');
        }
    };
    SocketBase.prototype.disconnect = function (address) {
        var endpoint = lodash_1.find(this.endpoints, function (e) { return e.address === address; });
        if (endpoint) {
            endpoint.removeListener('attach', this.attachEndpoint);
            endpoint.removeListener('terminated', this.endpointTerminated);
            endpoint.removeListener('message', this.xrecv);
            endpoint.removeListener('hiccuped', this.hiccuped);
            endpoint.close();
            lodash_1.pull(this.endpoints, endpoint);
            this.endpointTerminated(endpoint);
        }
    };
    SocketBase.prototype.bind = function (address, server) {
        if (address.startsWith("ws://") || address.startsWith("wss://")) {
            var listener = new webSocketListener_1.default(address, server, this.options);
            listener.on('attach', this.bindAttachEndpoint);
            this.binds.push(listener);
        }
        else {
            throw new Error('unsupported transport');
        }
    };
    SocketBase.prototype.bindSync = function (address, server) {
        return this.bind(address, server);
    };
    SocketBase.prototype.unbind = function (address) {
        var listener = lodash_1.find(this.binds, function (b) { return b.address === address; });
        if (listener) {
            listener.removeListener('attach', this.attachEndpoint);
            listener.close();
            lodash_1.pull(this.binds, listener);
        }
    };
    SocketBase.prototype.close = function () {
        var _this = this;
        this.binds.forEach(function (listener) {
            listener.removeListener('attach', _this.attachEndpoint);
            listener.close();
        });
        this.binds = [];
        this.endpoints.forEach(function (endpoint) {
            endpoint.removeListener('attach', _this.attachEndpoint);
            endpoint.removeListener('terminated', _this.endpointTerminated);
            endpoint.removeListener('message', _this.xrecv);
            endpoint.removeListener('hiccuped', _this.hiccuped);
            endpoint.close();
            lodash_1.pull(_this.endpoints, endpoint);
            _this.endpointTerminated(endpoint);
        });
    };
    SocketBase.prototype.subscribe = function (topic) {
        throw new Error('not supported');
    };
    SocketBase.prototype.unsubscribe = function (topic) {
        throw new Error('not supported');
    };
    SocketBase.prototype.bindAttachEndpoint = function (endpoint) {
        endpoint.on('terminated', this.bindEndpointTerminated);
        endpoint.on('message', this.xrecv);
        this.attachEndpoint(endpoint);
    };
    SocketBase.prototype.bindEndpointTerminated = function (endpoint) {
        endpoint.removeListener('terminated', this.bindEndpointTerminated);
        endpoint.removeListener('message', this.xrecv);
        this.endpointTerminated(endpoint);
    };
    SocketBase.prototype.attachEndpoint = function (endpoint) {
    };
    SocketBase.prototype.endpointTerminated = function (endpoint) {
    };
    SocketBase.prototype.hiccuped = function (endpoint) {
    };
    SocketBase.prototype.xrecv = function (endpoint) {
        var frames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            frames[_i - 1] = arguments[_i];
        }
    };
    SocketBase.prototype.xsend = function (msg) {
    };
    SocketBase.prototype.send = function (msg) {
        if (Array.isArray(msg))
            this.xsend(msg);
        else
            this.xsend([msg]);
    };
    return SocketBase;
}(EventEmitter));
exports.default = SocketBase;
//# sourceMappingURL=socketBase.js.map