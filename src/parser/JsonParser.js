var Parser = require("./Parser.js");
var JsonConfig = require("../config/JsonConfig.js");

class JsonParser extends Parser {
    /**
     * Parse the string content to an object.
     * @param {string} content A string from zookeeper server.
     * @param {function} callback With parameter (err: Error, config: Config) 
     */
    parse(content, callback) {
        // parse the content to an config.
        var obj = null;
        var err = null;
        if(content && typeof content === "string"){
            try {
                obj = JSON.parse(content)
            } catch (e) {
                err = e;
            }
        }        
        callback && callback(err, obj != null ? new JsonConfig(obj) : null);
    }
}

module.exports = exports = JsonParser;
