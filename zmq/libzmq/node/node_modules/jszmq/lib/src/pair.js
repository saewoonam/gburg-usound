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
var socketBase_1 = require("./socketBase");
var Pair = /** @class */ (function (_super) {
    __extends(Pair, _super);
    function Pair() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.pending = [];
        return _this;
    }
    Pair.prototype.attachEndpoint = function (endpoint) {
        if (this.endpoint) {
            endpoint.close();
            return;
        }
        this.endpoint = endpoint;
        while (true) {
            var msg = this.pending.shift();
            if (!msg)
                break;
            if (!endpoint.send(msg))
                break;
        }
    };
    Pair.prototype.endpointTerminated = function (endpoint) {
        if (endpoint === this.endpoint)
            this.endpoint = undefined;
    };
    Pair.prototype.xrecv = function (endpoint) {
        var frames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            frames[_i - 1] = arguments[_i];
        }
        if (endpoint === this.endpoint)
            this.emit.apply(this, ['message'].concat(frames));
    };
    Pair.prototype.xsend = function (msg) {
        if (this.endpoint)
            this.endpoint.send(msg);
        else
            this.pending.push(msg);
    };
    return Pair;
}(socketBase_1.default));
exports.default = Pair;
//# sourceMappingURL=pair.js.map