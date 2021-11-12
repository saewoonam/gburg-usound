"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
function swap(items, index1, index2) {
    if (index1 === index2)
        return;
    var item1 = items[index1];
    var item2 = items[index2];
    if (item1 !== null)
        items[index2] = item1;
    if (item2 !== null)
        items[index1] = item2;
}
var Distribution = /** @class */ (function () {
    function Distribution() {
        this.endpoints = [];
        this.matching = 0;
        this.active = 0;
    }
    Distribution.prototype.attach = function (endpoint) {
        this.endpoints.push(endpoint);
        swap(this.endpoints, this.active, this.endpoints.length - 1);
        this.active++;
    };
    Distribution.prototype.match = function (endpoint) {
        var index = this.endpoints.indexOf(endpoint);
        // If pipe is already matching do nothing.
        if (index < this.matching)
            return;
        // If the pipe isn't active, ignore it.
        if (index >= this.active)
            return;
        // Mark the pipe as matching.
        swap(this.endpoints, index, this.matching);
        this.matching++;
    };
    Distribution.prototype.unmatch = function () {
        this.matching = 0;
    };
    Distribution.prototype.terminated = function (endpoint) {
        // Remove the endpoint from the list; adjust number of matching, active and/or
        // eligible endpoint accordingly.
        if (this.endpoints.indexOf(endpoint) < this.matching)
            this.matching--;
        if (this.endpoints.indexOf(endpoint) < this.active)
            this.active--;
        lodash_1.pull(this.endpoints, endpoint);
    };
    Distribution.prototype.activated = function (endpoint) {
        // Move the pipe from passive to active state.
        swap(this.endpoints, this.endpoints.indexOf(endpoint), this.active);
        this.active++;
    };
    Distribution.prototype.sendToAll = function (msg) {
        this.matching = this.active;
        this.sendToMatching(msg);
    };
    Distribution.prototype.sendToMatching = function (msg) {
        // If there are no matching pipes available, simply drop the message.
        if (this.matching === 0)
            return;
        for (var i = 0; i < this.matching; i++) {
            if (!this.write(this.endpoints[i], msg))
                --i; //  Retry last write because index will have been swapped
        }
    };
    Distribution.prototype.write = function (endpoint, msg) {
        if (!endpoint.send(msg)) {
            swap(this.endpoints, this.endpoints.indexOf(endpoint), this.matching - 1);
            this.matching--;
            swap(this.endpoints, this.endpoints.indexOf(endpoint), this.active - 1);
            this.active--;
            return false;
        }
        return true;
    };
    return Distribution;
}());
exports.default = Distribution;
//# sourceMappingURL=distribution.js.map