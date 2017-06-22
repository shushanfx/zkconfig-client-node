var AbstractConfig = require("./AbstractConfig.js")

class JSONConfig extends AbstractConfig{
	constructor(value){
		super(value)
	}
}

exports = module.exports = JSONConfig;