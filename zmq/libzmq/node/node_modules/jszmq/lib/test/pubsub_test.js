"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsmq = require("../src");
describe('pubsub', function () {
    it('subscribe', function (done) {
        var pub = new jsmq.XPub();
        var sub = new jsmq.Sub();
        pub.bind('ws://localhost:55556');
        sub.subscribe('A');
        sub.connect('ws://localhost:55556');
        // Waiting for subscriptions before publishing
        pub.once('message', function () {
            pub.send('B');
            pub.send('AAA');
            sub.once('message', function (topic) {
                expect(topic.toString()).toBe('AAA');
                pub.close();
                sub.close();
                done();
            });
        });
    });
    it('unsubscribe', function (done) {
        var pub = new jsmq.XPub();
        var sub = new jsmq.Sub();
        pub.bind('ws://localhost:55556');
        sub.subscribe('A');
        sub.subscribe('B');
        sub.connect('ws://localhost:55556');
        // Waiting for subscriptions before publishing
        pub.once('message', function () {
            pub.send('A');
            sub.once('message', function (topic) {
                sub.unsubscribe('A');
                pub.send('A');
                pub.send('B');
                sub.once('message', function (topic2) {
                    expect(topic2.toString()).toBe('B');
                    pub.close();
                    sub.close();
                    done();
                });
            });
        });
    });
});
//# sourceMappingURL=pubsub_test.js.map