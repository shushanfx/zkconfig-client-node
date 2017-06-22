var Client = require("./src/client.js");

module.exports = exports = {
	Client: Client,
	AbstractConfig: require("./src/config/AbstractConfig.js"),
	JsonConfig: require("./src/config/JsonConfig.js"),
	PropertiesConfig: require("./src/config/PropertiesConfig.js"),
	Parser: require("./src/parser/Parser.js"),
	JsonParser: require("./src/parser/JsonParser.js"),
	PropertiesParser: require("./src/parser/PropertiesParser.js"),
}