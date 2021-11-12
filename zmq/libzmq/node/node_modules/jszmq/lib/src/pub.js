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
var xpub_1 = require("./xpub");
var Pub = /** @class */ (function (_super) {
    __extends(Pub, _super);
    function Pub() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Pub.prototype.xxrecv = function (endpoint) {
        var frames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            frames[_i - 1] = arguments[_i];
        }
        // Drop any message sent to pub socket
    };
    Pub.prototype.sendUnsubscription = function () {
    };
    return Pub;
}(xpub_1.default));
exports.default = Pub;
//# sourceMappingURL=pub.js.map