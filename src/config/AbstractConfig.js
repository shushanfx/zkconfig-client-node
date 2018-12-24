class AbstractConfig{
	constructor(value){
		this.value = value;
	}
	getList(path, defaultValue){
		var obj = this.getObject(path, null);
		if(Array.isArray(obj)){
			return obj;
		}
		return defaultValue;
	}
	forEach(path, callback){
		var obj = this.getObject(path, null);
		if(typeof obj !== "undefined"){
			if(typeof obj === "number"
				|| typeof obj === "boolean"
				|| typeof obj === "string"){
				callback && callback.call(this, obj, 0, obj);
			}
			else if(Array.isArray(obj)){
				obj.forEach((item, index) => {
					callback && callback.call(this, item, index, obj);
				});
			}
			else if(obj != null){
				Object.keys(obj).forEach((item, index) => {
					callback && callback.call(this, obj[key], key, obj);
				});
			}
		}
	}
	getString(path, defaultValue){
		var obj = this.getObject(path, null);
		if(typeof obj != "undefined" && obj != null){
			return obj.toString();
		}
		return defaultValue;
	}
	getBoolean(path, defaultValue){
		var obj = this.getObject(path, null);
		if(obj != null){
			return !!obj;
		}
		return defaultValue;
	}
	getInteger(path, defaultValue){
		var obj = this.getObject(path, null);
		if(obj != null){
			var intValue = parseInt(obj.toString(), 10);
			if(!Number.isNaN(intValue)){
				return intValue;
			}	
		}	
		return defaultValue;
	}
	getFloat(path, defaultValue){
		var obj = this.getObject(path, null);
		if(obj != null){
			var intValue = parseFloat(obj.toString());
			if(!Number.isNaN(intValue)){
				return intValue;
			}	
		}	
		return defaultValue;
	}
	getObject(path, defaultValue){
		if(this.value){
			var myValue = this.value[path];
			if(typeof myValue !== "undefined"){
				return myValue;
			}
		}
		return defaultValue;
	}
	get(path, defaultValue){
		return this.getObject(path, defaultValue);
	}
}
module.exports = exports = AbstractConfig;
