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
var buffer_1 = require("buffer");
var InprocEndpoint = /** @class */ (function (_super) {
    __extends(InprocEndpoint, _super);
    function InprocEndpoint(address, options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.routingKey = buffer_1.Buffer.alloc(0);
        _this.routingKeyString = '';
        _this.address = address;
        if (_this.options.immediate)
            _this.emit('attach', _this);
        return _this;
    }
    InprocEndpoint.prototype.close = function () {
    };
    InprocEndpoint.prototype.send = function (msg) {
        var frames = msg.map(function (f) { return buffer_1.Buffer.isBuffer(f) ? f : buffer_1.Buffer.from(f, 'utf8'); });
        //setTimeout(() => this.peer.emit('message', ...frames), 0)
        return true;
    };
    return InprocEndpoint;
}(EventEmitter));
exports.default = InprocEndpoint;
