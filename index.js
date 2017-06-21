var Client = require("./src/client.js");

module.exports = exports = {
	Client: Client,
	AbstractConfig: require("./src/config/abstractConfig.js"),
	JsonConfig: require("./src/config/json.js"),
	PropertiesConfig: require("./src/config/properties.js")
}