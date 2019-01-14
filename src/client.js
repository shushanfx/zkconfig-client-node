var zookeeper = require("node-zookeeper-client");
var merge = require("merge");
var uuid = require("uuid");
var ip = require("ip");
var events = require("events")

var ZKConfigError = require("./error.js");
var Cache = require('./cache');
var ParserIndex = require('./parser');
var DefaultParser = require('./parser/Parser');

class Client extends events.EventEmitter {
    constructor(servers, options) {
        super();
        if (typeof servers === "object") {
            options = servers;
            servers = null;
        }
        this.options = merge({
            servers: servers,
            scheme: "digest",
            maxRetryTimes: 10,
            connectTimeout: 10000
        }, options);
        this.path = this.options.path;
        this.monitor = !!this.options.monitor;
        this.monitorPath = this.options.monitorPath;
        this.username = this.options.username;
        this.password = this.options.password;
        this.scheme = this.options.scheme || "digest";
        this.servers = this.options.servers;
        this.isConnected = false;
        this.isShutdown = false;
        this.retryTimes = 0;
        this.isFirstConnect = true;
    }
    connect() {
        this.client = zookeeper.createClient(this.servers, this.options);
        this._bindEvent();
        this._connect();
    }
    auth() {
        if (this.username) {
            this.client.addAuthInfo(this.scheme,
                Buffer.from([this.username, this.password].join(":")));
        }
    }
    close() {
        this.isShutdown = true;
        if (this.client != null) {
            this.client.close();
            this.client = null;
        }
    }
    _getContent() {
        var me = this;
        if (this.path &&
            this.client) {
            this.client.getData(this.path, function (event) {
                if (event) {
                    if (event.type === zookeeper.Event.NODE_DELETED) {
                        me.emit(Client.EVENT_ERROR,
                            new ZKConfigError(new Error("Data node has been removed."),
                                ZKConfigError.ERROR_READ));
                        // load from cache
                        me.loadCache();
                    } else {
                        me._getContent();
                    }
                }
            }, function (err, data) {
                if (err) {
                    me.emit(Client.EVENT_ERROR, new ZKConfigError(err,
                        ZKConfigError.ERROR_READ));
                } else {
                    var content = data.toString("UTF8");
                    me.readContent(content, true);
                }
            });
        }
    }
    _bindEvent() {
        var me = this;
        this.client.on("state", function (state) {
            if (state === zookeeper.State.SYNC_CONNECTED) {
                me.isConnected = true;
                // Set the retry time to zero.
                me.retryTimes = 0;
                me.auth();
                me._notifyMonitor();
                me._getContent();
                me.emit(Client.EVENT_CONNECTED);
            } else if (state === zookeeper.State.DISCONNECTED ||
                state === zookeeper.State.EXPIRED) {
                me._connect();
            }
        });
        this.client.on("disconnected", function () {
            me._connect();
        });
        this.client.on("expired", function () {
            me._connect();
        });
    }
    _connect() {
        let me = this;
        if (!this.isShutdown &&
            this.retryTimes < this.options.maxRetryTimes) {
            this.retryTimes++;
            if (this.connectTimer) {
                clearTimeout(this.connectTimer);
            }
            this.client.connect();
            if (this.options.connectTimeout > 0) {
                this.client.once("connect", function () {
                    clearTimeout(this.connectTimer);
                    this.connectTimer = null;
                });
                this.connectTimer = setTimeout(function () {
                    me.emit(Client.EVENT_ERROR,
                        new ZKConfigError(new Error("Fail to connect to server"), ZKConfigError.ERROR_CONNECT));
                    // load from cache;
                    me.loadCache();
                    clearTimeout(this.connectTimer);
                    this.connectTimer = null;
                }, this.options.connectTimeout);
            }

        }
    }
    readContent(content, flushCache) {
        var me = this;
        var parser = me.options.parser;
        if (!parser) {
            var Parser = require("./parser/PropertiesParser.js");
            parser = new Parser();
            me.options.parser = parser;
        } else if (typeof parser === "string") {
            let parserFactory = ParserIndex.get(parser);
            if (parserFactory) {
                parser = parserFactory(me.options);
                me.options.parser = parser;
            }
        }
        if (flushCache) {
            me.flushCache(content);
        }
        if (parser && parser instanceof DefaultParser) {
            parser.parse(content, (err, config) => {
                if (err) {
                    me.emit(Client.EVENT_ERROR, new ZKConfigError(err,
                        ZKConfigError.ERROR_PARSE));
                } else {
                    me.config = config;
                    try {
                        me.emit(Client.EVENT_DATA, config, me)
                    } catch (e) {
                        me.emit(Client.EVENT_ERROR, new ZKConfigError(e,
                            ZKConfigError.ERROR_HANDLE));
                    };
                }
            });
        } else {
            me.emit(Client.EVENT_ERROR, new ZKConfigError(new Error('No parser.'),
                ZKConfigError.ERROR_PARSE));
        }

    }
    loadCache(callback) {
        let path = this.path;
        let fileName = path.replace(/\//g, '.');
        let me = this;
        Cache.getCache(fileName, function (content) {
            if (content === null) {
                me.emit(Client.EVENT_ERROR, new ZKConfigError(err,
                    ZKConfigError.ERROR_CACHE_READ));
            } else {
                me.readContent(content, false);
            }
        });
    }
    flushCache(content) {
        let path = this.path;
        let fileName = path.replace(/\//g, '.');
        Cache.setCache(fileName, content, function (isSuccess) {
            if (!isSuccess) {
                me.emit(Client.EVENT_ERROR, new ZKConfigError(err,
                    ZKConfigError.ERROR_CACHE_WRITE));
            }
        });
    }
    _notifyMonitor() {
        var me = this;
        if (this.monitor) {
            var obj = {
                id: uuid.v4(),
                path: this.path,
                ip: ip.address(),
                connectedTime: Date.now()
            }
            this.client.create(this._join(this.monitorPath, obj.id),
                Buffer.from(JSON.stringify(obj)),
                zookeeper.CreateMode.EPHEMERAL,
                function (err, path) {
                    if (err) {
                        me.emit(Client.EVENT_ERROR, new ZKConfigError(new Error("Fail to regiester monitor path: " + path),
                            ZKConfigError.ERROR_MONITOR));
                    }
                });
        }
    }
    _join() {
        var p = "";
        for (let i = 0; i < arguments.length; i++) {
            if (arguments[i] && typeof arguments[i] === "string") {
                p += "/" + arguments[i];
            }
        }
        if (p) {
            return p.substring(1);
        }
        return p;
    }
}
Client.EVENT_CONNECTED = "connected";
Client.EVENT_DATA = "data";
Client.EVENT_ERROR = "error";


module.exports = exports = Client;