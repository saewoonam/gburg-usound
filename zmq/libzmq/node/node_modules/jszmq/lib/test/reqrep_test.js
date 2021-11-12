"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsmq = require("../src");
describe('reqrep', function () {
    it('simple request response', function (done) {
        var req = new jsmq.Req();
        var rep = new jsmq.Rep();
        rep.bind('ws://localhost:55556');
        req.connect('ws://localhost:55556');
        req.send('Hello');
        rep.once('message', function (msg) {
            expect(msg.toString()).toEqual('Hello');
            rep.send('World');
        });
        req.once('message', function (msg) {
            expect(msg.toString()).toEqual('World');
            req.close();
            rep.close();
            done();
        });
    });
    it('multiple requests', function (done) {
        var rep = new jsmq.Rep();
        var reqs = [];
        var last = new jsmq.Req();
        rep.bind('ws://localhost:55556');
        for (var i = 0; i < 100; i++) {
            reqs[i] = new jsmq.Req();
            reqs[i].connect('ws://localhost:55556');
        }
        last.connect('ws://localhost:55556');
        rep.on('message', function (msg) { return rep.send(msg); });
        var _loop_1 = function (i) {
            reqs[i].send(i.toString());
            reqs[i].once('message', function (reply) { return expect(reply.toString()).toEqual(i.toString()); });
        };
        for (var i = 0; i < 100; i++) {
            _loop_1(i);
        }
        last.send('done');
        last.once('message', function (reply) {
            expect(reply.toString()).toEqual('done');
            for (var i = 0; i < 100; i++)
                reqs[i].close();
            last.close();
            rep.close();
            done();
        });
    });
});
//# sourceMappingURL=reqrep_test.js.map