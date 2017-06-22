var Parser = require("./Parser.js");
var PropertiesConfig = require("../config/PropertiesConfig.js");

class PropertiesParser extends Parser{
    parse(content, callback){
        if(content && typeof content === "string"){
			var contents = content.split("\n");
            var err = null;
			const obj = {};
            try{
                contents.forEach(item => {	
                    if(item && !item.startsWith("#")){
                        var indexOfEQ = item.indexOf("=");
                        if(indexOfEQ > 0){
                            var key = item.substring(0, indexOfEQ).trim();
                            var value = item.substring(indexOfEQ + 1).trim();
                            if(key && value){
                                obj[key] = value;
                            }
                        }
                    }
                });
            } catch(e){
                err = e;
            }
            callback && callback(err, new PropertiesConfig(obj));
        }    
        else{
            callback && callback(null, null);
        }
    }
}

module.exports = exports = PropertiesParser;
