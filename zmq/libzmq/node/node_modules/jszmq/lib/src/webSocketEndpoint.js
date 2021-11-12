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
var WebSocket = require("isomorphic-ws");
var buffer_1 = require("buffer");
var lodash_1 = require("lodash");
var State;
(function (State) {
    State[State["Closed"] = 0] = "Closed";
    State[State["Connecting"] = 1] = "Connecting";
    State[State["Reconnecting"] = 2] = "Reconnecting";
    State[State["Active"] = 3] = "Active";
})(State || (State = {}));
var WebSocketEndpoint = /** @class */ (function (_super) {
    __extends(WebSocketEndpoint, _super);
    function WebSocketEndpoint(address, options) {
        var _this = _super.call(this) || this;
        _this.frames = [];
        _this.queue = [];
        _this.routingIdReceived = false;
        _this.routingKey = buffer_1.Buffer.alloc(0);
        _this.routingKeyString = '';
        _this.options = options;
        _this.connect = _this.connect.bind(_this);
        if (lodash_1.isString(address)) {
            _this.address = address;
            _this.state = State.Connecting;
            _this.accepted = false;
            _this.connect();
        }
        else {
            _this.routingIdReceived = false;
            _this.address = '';
            _this.socket = address;
            _this.accepted = true;
            _this.state = State.Active;
            _this.socket.binaryType = "arraybuffer";
            _this.socket.onclose = _this.onClose.bind(_this);
            _this.socket.onmessage = _this.onMessage.bind(_this);
            _this.send([_this.options.routingId]);
        }
        return _this;
    }
    WebSocketEndpoint.prototype.connect = function () {
        if (this.state === State.Closed)
            return; // The socket was already closed, abort
        this.routingIdReceived = false;
        this.socket = new WebSocket(this.address, ['ZWS2.0']);
        this.socket.binaryType = "arraybuffer";
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
    };
    WebSocketEndpoint.prototype.onOpen = function () {
        var _this = this;
        var oldState = this.state;
        this.state = State.Active;
        this.send([this.options.routingId]);
        this.queue.forEach(function (frame) { return _this.socket.send(frame); });
        this.queue = [];
        if (this.options.immediate)
            this.emit('attach', this);
        else if (oldState === State.Reconnecting)
            this.emit('hiccuped', this);
    };
    WebSocketEndpoint.prototype.onClose = function () {
        if (this.accepted) {
            this.state = State.Closed;
            this.emit('terminated', this);
        }
        else if (this.state !== State.Closed) {
            if ((this.state === State.Active || this.state === State.Connecting) && this.options.immediate)
                this.emit('terminated', this);
            if (this.state === State.Active)
                this.state = State.Reconnecting;
            setTimeout(this.connect, this.options.reconnectInterval);
        }
    };
    WebSocketEndpoint.prototype.error = function () {
        this.socket.close();
    };
    WebSocketEndpoint.prototype.onMessage = function (message) {
        if (!this.routingIdReceived) {
            this.routingIdReceived = true;
            if (!this.options.recvRoutingId)
                return;
        }
        if (message.data instanceof ArrayBuffer) {
            var buffer = buffer_1.Buffer.from(message.data);
            if (buffer.length > 0) {
                var more = buffer.readUInt8(0) === 1;
                var msg = buffer.slice(1);
                this.frames.push(msg);
                if (!more) {
                    this.emit.apply(this, ["message", this].concat(this.frames));
                    this.frames = [];
                }
            }
            else
                this.error();
        }
        else
            this.error();
    };
    WebSocketEndpoint.prototype.close = function () {
        if (this.state !== State.Closed) {
            this.state = State.Closed;
            if (this.socket.readyState === this.socket.CONNECTING || this.socket.readyState === this.socket.OPEN)
                this.socket.close();
            this.emit('terminated', this);
        }
    };
    WebSocketEndpoint.prototype.send = function (msg) {
        if (this.state === State.Closed)
            return false;
        for (var i = 0, len = msg.length; i < len; i++) {
            var isLast = i === len - 1;
            var flags = isLast ? 0 : 1;
            var frame = msg[i];
            if (lodash_1.isString(frame))
                frame = buffer_1.Buffer.from(frame, 'utf8');
            else if (frame instanceof ArrayBuffer || frame instanceof buffer_1.Buffer) {
                // Nothing to do, use as is
            }
            else {
                throw new Error('invalid message type');
            }
            var flagsArray = buffer_1.Buffer.alloc(1);
            flagsArray.writeUInt8(flags, 0);
            var buffer = buffer_1.Buffer.concat([flagsArray, frame]);
            if (this.state === State.Active)
                this.socket.send(buffer);
            else
                this.queue.push(buffer);
        }
        return true;
    };
    return WebSocketEndpoint;
}(EventEmitter));
exports.default = WebSocketEndpoint;
//# sourceMappingURL=webSocketEndpoint.js.map