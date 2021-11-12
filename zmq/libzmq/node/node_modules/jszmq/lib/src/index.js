"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dealer_1 = require("./dealer");
var router_1 = require("./router");
var sub_1 = require("./sub");
var xsub_1 = require("./xsub");
var pub_1 = require("./pub");
var xpub_1 = require("./xpub");
var pull_1 = require("./pull");
var push_1 = require("./push");
var pair_1 = require("./pair");
var req_1 = require("./req");
var rep_1 = require("./rep");
function socket(type) {
    switch (type) {
        case 'dealer':
            return new dealer_1.default();
        case 'router':
            return new router_1.default();
        case 'pub':
            return new pub_1.default();
        case 'sub':
            return new sub_1.default();
        case 'xsub':
            return new xsub_1.default();
        case 'xpub':
            return new xpub_1.default();
        case 'pull':
            return new pull_1.default();
        case 'push':
            return new push_1.default();
        case 'pair':
            return new pair_1.default();
        case 'req':
            return new req_1.default();
        case 'rep':
            return new rep_1.default();
        default:
            throw new Error('Unsupported socket type');
    }
}
exports.socket = socket;
var sub_2 = require("./sub");
exports.Sub = sub_2.default;
var xsub_2 = require("./xsub");
exports.XSub = xsub_2.default;
var router_2 = require("./router");
exports.Router = router_2.default;
var dealer_2 = require("./dealer");
exports.Dealer = dealer_2.default;
var xpub_2 = require("./xpub");
exports.XPub = xpub_2.default;
var pub_2 = require("./pub");
exports.Pub = pub_2.default;
var push_2 = require("./push");
exports.Push = push_2.default;
var pull_2 = require("./pull");
exports.Pull = pull_2.default;
var pair_2 = require("./pair");
exports.Pair = pair_2.default;
var req_2 = require("./req");
exports.Req = req_2.default;
var rep_2 = require("./rep");
exports.Rep = rep_2.default;
var buffer_1 = require("buffer");
exports.Buffer = buffer_1.Buffer;
//# sourceMappingURL=index.js.map