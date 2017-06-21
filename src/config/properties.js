var AbstractConfig = require("./abstractConfig")

class PropertiesConfig extends AbstractConfig {
	constructor(){
		super();
	}
	parse(content){
		if(content && typeof content === "string"){
			var contents = content.split("\n");
			const obj = {};
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
			this.value = {
				get: function(path){
					if(obj && path && typeof(path) === "string"){
						return obj[path];
					}
					return obj;
				},
				forEach: function(path, callback){
					if(obj){
						if(path && typeof(path) === "string"){
							var newValue = obj[path];
							if(newValue && typeof newValue === "object"){
								for(let key of newValue){
									callback && callback(key, newValue, newValue);
								}
							}
						}
						else{
							for(let key of obj){
								callback && callback(key, obj[key], obj);
							}
						}
					}
				}
			}
		}
		else {
			this.value = null;
		}
	}
}

exports = module.exports = PropertiesConfig