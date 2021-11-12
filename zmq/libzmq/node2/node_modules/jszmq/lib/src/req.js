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
var dealer_1 = require("./dealer");
var buffer_1 = require("buffer");
var Req = /** @class */ (function (_super) {
    __extends(Req, _super);
    function Req() {
        var _this = _super.call(this) || this;
        _this.receivingReply = false;
        return _this;
    }
    Req.prototype.xsend = function (msg) {
        // If we've sent a request and we still haven't got the reply,
        // we can't send another request.
        if (this.receivingReply)
            throw new Error("cannot send another request");
        var withBottom = [Req.bottom].concat(msg);
        _super.prototype.xsend.call(this, withBottom);
        this.receivingReply = true;
    };
    Req.prototype.xrecv = function (endpoint, bottom) {
        var frames = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            frames[_i - 2] = arguments[_i];
        }
        // If request wasn't send, we can't process reply, drop.
        if (!this.receivingReply)
            return;
        //  Skip messages until one with the right first frames is found.
        if (frames.length === 0 || bottom.length !== 0)
            return;
        this.receivingReply = false;
        _super.prototype.xrecv.apply(this, [endpoint].concat(frames));
    };
    Req.bottom = buffer_1.Buffer.alloc(0);
    return Req;
}(dealer_1.default));
exports.default = Req;
//# sourceMappingURL=req.js.map