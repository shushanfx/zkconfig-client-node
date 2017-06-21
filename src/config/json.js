var AbstractConfig = require("./abstractConfig")

class JSONConfig extends AbstractConfig{
	constructor(){
		super()
	}
	parse(content){
		if(content){
			const obj = JSON.parse(content);
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
		else{
			this.value = null;
		}
	}
}

exports = module.exports = JSONConfig;