var ZKConfig = require("../../index.js");

describe("I have a dream.", function(){
	var client = null;
	var config = null;
	beforeAll(function(callback){
		client = new ZKConfig.Client("10.110.28.204:2181", {
			path: "/zkconfig/config/test",
			monitor: true,
			monitorPath: "/zkconfig/connection",
		});
		client.on("connected", function(){
			console.info("connected");
			callback();
		});
		client.on("data", function(data){
			config = data;	
		});
		client.connect();
	});
	it("Yes", function(callback){
		if(!config){
			client.on("data", function(config){
				console.info(config.get("name"))
				callback();
			});
		}	
		else{
			console.info("name, " + config.get("name"))
			callback();
		}
	});
	afterAll(function(){
		client.close();
	});
})