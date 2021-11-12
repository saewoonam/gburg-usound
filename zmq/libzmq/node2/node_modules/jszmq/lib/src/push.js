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
var Push = /** @class */ (function (_super) {
    __extends(Push, _super);
    function Push() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.loadBalancer = new loadBalancer_1.default();
        _this.pending = [];
        return _this;
    }
    Push.prototype.attachEndpoint = function (endpoint) {
        this.loadBalancer.attach(endpoint);
        while (true) {
            var msg = this.pending.shift();
            if (!msg)
                break;
            if (!this.loadBalancer.send(msg))
                break;
        }
    };
    Push.prototype.endpointTerminated = function (endpoint) {
        this.loadBalancer.terminated(endpoint);
    };
    Push.prototype.xsend = function (msg) {
        if (!this.loadBalancer.send(msg))
            this.pending.push(msg);
    };
    return Push;
}(socketBase_1.default));
exports.default = Push;
//# sourceMappingURL=push.js.map