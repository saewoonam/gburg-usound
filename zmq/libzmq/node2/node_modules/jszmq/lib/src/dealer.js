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
var loadBalancer_1 = require("./utils/loadBalancer");
var Dealer = /** @class */ (function (_super) {
    __extends(Dealer, _super);
    function Dealer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.loadBalancer = new loadBalancer_1.default();
        _this.pending = [];
        return _this;
    }
    Dealer.prototype.attachEndpoint = function (endpoint) {
        this.loadBalancer.attach(endpoint);
        while (true) {
            var msg = this.pending.shift();
            if (!msg)
                break;
            if (!this.loadBalancer.send(msg))
                break;
        }
    };
    Dealer.prototype.endpointTerminated = function (endpoint) {
        this.loadBalancer.terminated(endpoint);
    };
    Dealer.prototype.xrecv = function (endpoint) {
        var frames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            frames[_i - 1] = arguments[_i];
        }
        this.emit.apply(this, ['message'].concat(frames));
    };
    Dealer.prototype.xsend = function (msg) {
        if (!this.loadBalancer.send(msg))
            this.pending.push(msg);
    };
    return Dealer;
}(socketBase_1.default));
exports.default = Dealer;
//# sourceMappingURL=dealer.js.map