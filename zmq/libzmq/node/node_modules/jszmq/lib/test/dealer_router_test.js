"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsmq = require("../src");
describe('dealer-router', function () {
    it('ping-pong', function (done) {
        var router = new jsmq.Router();
        var dealer = new jsmq.Dealer();
        router.bind('ws://localhost:3002/dealer-router');
        dealer.connect('ws://localhost:3002/dealer-router');
        dealer.send('hello');
        router.once('message', function (routingId, message) {
            expect(message.toString()).toBe('hello');
            router.send([routingId, 'world']);
            dealer.once('message', function (reply) {
                expect(reply.toString()).toBe('world');
                done();
            });
        });
    });
});
//# sourceMappingURL=dealer_router_test.js.map