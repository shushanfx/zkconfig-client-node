# ZKConfig Client Node
A node client for zookeeper config system. You can refer the server [here](https://github.com/shushanfx/zkconfig-server)

## How to use?
It is easy to use this.
```bash
npm install zkconfig-client-node
```
In your node code:
```javascript
var ZKConfig = require("zkconfig-client-node");

var client = new ZKConfig.Client("127.0.0.1:2181", {
    path: "/zkconfig/config/dev",
    monitor: true,
    monitorPath: "/zkconfig/connection",
    username: "zkconfig",
    password: "zkconfig"
});
client.on("connected", function(){
    console.info("connected");
});
client.on("data", function(config){
    // get a config object.
    console.info("name: " + config.get("name")); 
});
client.connect();
```

## API
The ZKConfig client has three important object: Client, Parser, Config.     
Client is the main object that communicate with the zookeeper server.     
Parser is an object to convert string content to a Config instance.     
Config is an object to store data that loaded from server by a Client object.
### Client
* constructor(servers, options): the construct function.    
> servers: the zookeeper servers, seperated by `,`.     
> options: the options for the client.      
>   path: String, required. The path to store the config.
>   monitor: Boolean, optional. Whether to uploat the connection information.
>   monitorPath: String, optional. The path to sotre the connection information, must be the same with `zkserver`'s connectionPath. if `monitor` is true, this parameter must be an existed path in zookeeper server.
>   username: String, optional. username for auth.
>   password: String, opational,  password for auth.
>   scheme: String, optional, default "digest".
>   parser: an parser object, optional, default is PropertiesParser.
other options please refer to [node-zookeeper-client](https://github.com/alexguan/node-zookeeper-client)
* connect(): connect to zookeeper server and emit a connected event when connect success.
* close(): release the connection.
* on(eventName, callback): register an event handler.
* off(eventName, callback): unreigster an event handler.
* event: the client instance will emit those events:
  * connected
  * data: the data load and parse success
  * error: the data load fail or parse fail or fail to create connection to the server.

### Parser
A parser to parse an string content to a config instance.
* parse(String content, callback), 
### Config
A instance to store data with convinient method to get data.
* get(path, defaultValue)
* getString(path, defaultValue)
* getInteger(path, defaultValue)
* getObject(path, defaultValue)
* getFloat(path, defaultValue)


## LICENSE
MIT

