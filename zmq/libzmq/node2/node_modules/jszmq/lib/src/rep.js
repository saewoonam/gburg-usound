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
var router_1 = require("./router");
var buffer_1 = require("buffer");
var setAsap = require("setasap");
var Rep = /** @class */ (function (_super) {
    __extends(Rep, _super);
    function Rep() {
        var _this = _super.call(this) || this;
        _this.sendingReply = false;
        _this.ids = [];
        _this.pending = [];
        return _this;
    }
    Rep.prototype.xsend = function (msg) {
        var _this = this;
        // If we are in the middle of receiving a request, we cannot send reply.
        if (!this.sendingReply)
            throw new Error("cannot send another reply");
        var withIds = this.ids.concat([Rep.bottom], msg);
        _super.prototype.xsend.call(this, withIds);
        this.ids = [];
        // We are ready to handle next message
        var nextMsg = this.pending.shift();
        if (nextMsg)
            setAsap(function () { return _this.recvInternal(nextMsg[0], nextMsg[1]); });
        else
            this.sendingReply = false;
    };
    Rep.prototype.recvInternal = function (endpoint, frames) {
        while (true) {
            var frame = frames.shift();
            // Invalid msg, dropping current msg
            if (!frame) {
                this.ids = [];
                var nextMsg = this.pending.shift();
                if (nextMsg)
                    this.recvInternal(nextMsg[0], nextMsg[1]);
                return;
            }
            // Reached bottom, enqueue msg
            if (frame.length === 0) {
                this.sendingReply = true;
                this.emit.apply(this, ['message'].concat(frames));
                return;
            }
            this.ids.push(frame);
        }
    };
    Rep.prototype.xxrecv = function (endpoint) {
        var frames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            frames[_i - 1] = arguments[_i];
        }
        // If we are in middle of sending a reply, we cannot receive next request yet, add to pending
        if (this.sendingReply)
            this.pending.push([endpoint, frames]);
        else
            this.recvInternal(endpoint, frames);
    };
    Rep.bottom = buffer_1.Buffer.alloc(0);
    return Rep;
}(router_1.default));
exports.default = Rep;
//# sourceMappingURL=rep.js.map