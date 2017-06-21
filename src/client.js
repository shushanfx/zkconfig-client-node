var zookeeper = require("node-zookeeper-client");
var merge = require("merge");
var uuid = require("uuid");
var ip = require("ip");
var events = require("events")

class Client extends events.EventEmitter {
	constructor(servers, options) {
		super();
		this.options = merge({
			servers: servers,
			scheme: "digest"
		}, options);
		this.path = this.options.path;
		this.monitor = !!this.options.monitor;
		this.monitorPath = this.options.monitorPath;
		this.username = this.options.username;
		this.password = this.options.password;
		this.scheme = this.options.scheme || "digest";
		this.servers = servers;
		this.isConnected = false;
		this.isShutdown = false;
	}
	init() {
		this.client = zookeeper.createClient(this.servers, this.options);
		this._bindEvent();
		this.connect();
	}
	_getContent() {
		var me = this;
		if (this.path && this.client) {
			this.client.getData(this.path, function (err, data, stat) {
				me._getContent();
			}, function (err, data, stat) {
				if (err) {
					console.error("Can not read ");
					me.emit(Client.EVENT_ERROR, err);
				}
				else {
					var content = data.toString("UTF8");
					var parser = me.options.parser;
					if (!parser) {
						var Config = require("./config/properties.js");
						parser = new Config();
						me.options.parser = parser;
					}
					parser.parse(content);
					me.config = parser;
					me.emit(Client.EVENT_DATA, parser, me);
				}
			});
		}
	}
	_bindEvent() {
		var me = this;
		this.client.on("state", function (state) {
			if (state === zookeeper.State.SYNC_CONNECTED) {
				me.isConnected = true;
				me.auth();
				me._notifyMonitor();
				me._getContent();
				me.emit(Client.EVENT_CONNECTED);
			}
			else if (state === zookeeper.State.DISCONNECTED
				|| state === zookeeper.State.EXPIRED) {
				me.reconnect();
			}
		});
		this.client.on("disconnected", function () {
			me.reconnect();
		});
		this.client.on("expired", function () {
			me.reconnect();
		});
	}
	auth() {
		if (this.username) {
			this.client.addAuthInfo(this.scheme,
				new Buffer([this.username, this.password].join(":")));
		}
	}
	connect() {
		if (!this.isShutdown) {
			this.client.connect();
		}
	}
	close() {
		this.isShutdown = true;
		if (this.client != null) {
			this.client.close();
			this.client = null;
		}
	}
	_notifyMonitor() {
		if (this.monitor) {
			var obj = {
				id: uuid.v4(),
				path: this.path,
				ip: ip.address(),
				connectedTime: Date.now()
			}
			this.client.create(this.join(this.monitorPath, obj.id),
				new Buffer(JSON.stringify(obj)),
				zookeeper.CreateMode.EPHEMERAL,
				function (err, path) {
					if (err) {
						console.error("Fail to regiester monitor path: " + path);
					}
				});
		}
	}
	join() {
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