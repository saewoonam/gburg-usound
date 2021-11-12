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
var WebSocket = require("isomorphic-ws");
var url_1 = require("url");
var lodash_1 = require("lodash");
var EventEmitter = require("events");
var webSocketEndpoint_1 = require("./webSocketEndpoint");
var url = require("url");
var HttpServerListener = /** @class */ (function () {
    function HttpServerListener(server) {
        this.server = server;
        this.servers = new Map();
        server.on('upgrade', this.onUpgrade.bind(this));
    }
    HttpServerListener.prototype.onUpgrade = function (request, socket, head) {
        // @ts-ignore
        var path = url.parse(request.url).pathname;
        var wsServer = this.servers.get(path);
        if (wsServer)
            wsServer.handleUpgrade(request, socket, head, function done(ws) {
                wsServer.emit('connection', ws, request);
            });
        else {
            socket.destroy();
        }
    };
    HttpServerListener.prototype.add = function (path, wsServer) {
        this.servers.set(path, wsServer);
    };
    HttpServerListener.prototype.remove = function (path) {
        this.servers.delete(path);
        if (this.servers.size === 0)
            listeners.delete(this.server);
    };
    return HttpServerListener;
}());
var listeners = new Map();
function getHttpServerListener(httpServer) {
    var listener = listeners.get(httpServer);
    if (listener)
        return listener;
    listener = new HttpServerListener(httpServer);
    listeners.set(httpServer, listener);
    return listener;
}
var WebSocketListener = /** @class */ (function (_super) {
    __extends(WebSocketListener, _super);
    function WebSocketListener(address, httpServer, options) {
        var _this = _super.call(this) || this;
        _this.address = address;
        _this.httpServer = httpServer;
        _this.options = options;
        _this.onConnection = _this.onConnection.bind(_this);
        if (!WebSocket.Server)
            throw 'binding websocket is not supported on browser';
        var url = new url_1.URL(address);
        var port;
        if (url.port)
            port = lodash_1.toNumber(url.port);
        else if (url.protocol === 'wss')
            port = 443;
        else if (url.protocol == 'ws')
            port = 80;
        else
            throw new Error('not a websocket address');
        if (httpServer) {
            _this.server = new WebSocket.Server({ noServer: true });
            var listener = getHttpServerListener(httpServer);
            _this.path = url.pathname;
            listener.add(url.pathname, _this.server);
        }
        else {
            _this.server = new WebSocket.Server({
                port: port,
                path: url.pathname
            });
        }
        _this.server.on('connection', _this.onConnection);
        return _this;
    }
    WebSocketListener.prototype.onConnection = function (connection) {
        var endpoint = new webSocketEndpoint_1.default(connection, this.options);
        this.emit('attach', endpoint);
    };
    WebSocketListener.prototype.close = function () {
        if (this.path && this.httpServer)
            getHttpServerListener(this.httpServer).remove(this.path);
        this.server.close();
    };
    return WebSocketListener;
}(EventEmitter));
exports.default = WebSocketListener;
//# sourceMappingURL=webSocketListener.js.map