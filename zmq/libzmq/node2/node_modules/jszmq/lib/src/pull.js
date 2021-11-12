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
var Pull = /** @class */ (function (_super) {
    __extends(Pull, _super);
    function Pull() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Pull.prototype.attachEndpoint = function (endpoint) {
    };
    Pull.prototype.endpointTerminated = function (endpoint) {
    };
    Pull.prototype.xrecv = function (endpoint) {
        var frames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            frames[_i - 1] = arguments[_i];
        }
        this.emit.apply(this, ['message'].concat(frames));
    };
    return Pull;
}(socketBase_1.default));
exports.default = Pull;
//# sourceMappingURL=pull.js.map