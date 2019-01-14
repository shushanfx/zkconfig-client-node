var ZKConfig = require("../../index.js");

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000

describe("I have a dream.", function () {
    var client = null;
    var config = null;
    var error = null;
    beforeAll(function (callback) {
        client = new ZKConfig.Client("10.138.30.208:2181", {
            path: "/zkconfig/config/gaokao_config_dev",
            monitor: true,
            monitorPath: "/zkconfig/connection",
            parser: 'json'
        });
        client.on("connected", function () {
            console.info("connected");
            callback();
        });
        client.on("data", function (data) {
            console.info("data");
            config = data;
        });
        client.on("error", function (err) {
            if (err instanceof Error) {
                console.info(err.message)
            }
            error = true;
            callback();
        });
        client.connect();
    });
    it("Yes", function (callback) {
        if (!config) {
            if (error) {
                console.error('Error read.');
                callback();
            } else {
                client.on("data", function (config) {
                    console.info("name, " + config.get("name"))
                    callback();
                });
            }
        } else {
            console.info("name, " + config.get("name"))
            callback();
        }
    });
    afterAll(function () {
        client.close();
    });
})