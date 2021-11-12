"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LoadBalancer = /** @class */ (function () {
    function LoadBalancer() {
        this.endpoints = [];
        this.current = 0;
    }
    LoadBalancer.prototype.attach = function (endpoint) {
        this.endpoints.push(endpoint);
    };
    LoadBalancer.prototype.terminated = function (endpoint) {
        var index = this.endpoints.indexOf(endpoint);
        if (this.current === this.endpoints.length - 1) {
            this.current = 0;
        }
        this.endpoints.splice(index, 1);
    };
    LoadBalancer.prototype.send = function (msg) {
        if (this.endpoints.length === 0)
            return false;
        var result = this.endpoints[this.current].send(msg);
        this.current = (this.current + 1) % this.endpoints.length;
        return result;
    };
    return LoadBalancer;
}());
exports.default = LoadBalancer;
//# sourceMappingURL=loadBalancer.js.map