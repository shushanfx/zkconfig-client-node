class AbstractConfig{
	constructor(){
		this.value = null;
	}
	getString(path, defaultValue){
		var obj = this.getObject(path, null);
		if(obj !== null){
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
			var myValue = this.value.get(path);
			if(typeof myValue !== "undefined"){
				return myValue;
			}
		}
		return defaultValue;
	}
	get(path, defaultValue){
		return this.getObject(path, defaultValue);
	}
	parse(content){}
}
module.exports = exports = AbstractConfig;