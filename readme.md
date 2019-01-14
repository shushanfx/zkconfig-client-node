# ZKConfig Client Node

A node client for zookeeper config system. You can refer the server [here](https://github.com/shushanfx/zkconfig-server)

## Features

- Read config from remote server.
- Multi types, such as json, properties, yaml.
- Config watcher,
- Low CPU, based on zookeeper, lower CPU.
- Failover, config replica via zookeeper system and read config from local file system in case of all servers went down.
- Easy config with admin web ui.

## How to use?

It is easy to use this.

```bash
npm install zkconfig-client-node
```

In your node code:

```javascript
var ZKConfig = require('zkconfig-client-node');

var client = new ZKConfig.Client('127.0.0.1:2181', {
  path: '/zkconfig/config/dev',
  monitor: true,
  monitorPath: '/zkconfig/connection',
  username: 'zkconfig',
  password: 'zkconfig'
});
client.on('connected', function() {
  // connected
  console.info('connected');
});
client.on('data', function(config) {
  // get a config object.
  console.info('name: ' + config.get('name'));
});
client.connect();
```

## API

The ZKConfig client has three important object: Client, Parser, Config.  
Client is the main object that communicate with the zookeeper server.  
Parser is an object to convert string content to a Config instance.  
Config is an object to store data that loaded from server by a Client object.

### Client

- constructor(servers, options): the construct function.
  > **servers**: the zookeeper servers, seperated by `,`.  
  > **options**: the options for the client.  
  >  **path**: String, required. The path to store the config.
  >
  > - **monitor**: Boolean, optional. Whether to uploat the connection information.
  > - **monitorPath**: String, optional. The path to sotre the connection information, must be the same with `zkserver`'s connectionPath. if `monitor` is true, this parameter must be an existed path in zookeeper server.
  > - **username**: String, optional. username for auth.
  > - **password**: String, opational, password for auth.
  > - **scheme**: String, optional, default "digest".
  > - **parser**: string or a parser instance, optional, default is `PropertiesParser`.
  > - More other options please refer to [node-zookeeper-client](https://github.com/alexguan/node-zookeeper-client)
- connect(): connect to zookeeper server and emit a connected event when connect success.
- close(): release the connection.
- on(eventName, callback): register an event handler.
- off(eventName, callback): unreigster an event handler.
- event: the client instance will emit those events:
  - connect: fire while connect successfully.
  - data: the data loaded and parsed successfully.
  - error: the data loaded fail, parsed fail or fail to create connection to the server.

### Parser

A parser to parse an string content to a config instance.

- parse(String content, callback)
  - `content`, a string content from zookeeper server.
  - `callback`, function(err: Error, config : Config), a config instance, if parse fail or content is full, config will return null.
    There are three parser:
- `JsonParser`, parser for json content.
- `PropertiesParser`, parser for java properties file.
- `YamlParser`, parser for yaml content.
- `register`, register a parser
  - `key`, the name of parser, eg: json, properties
  - `factory`, the factory of a parser, return a Parser instance.

### Config

A instance to store data with convinient method to get data.

- `get(path, defaultValue)`
- `getString(path, defaultValue)`
- `getInteger(path, defaultValue)`
- `getObject(path, defaultValue)`
- `getFloat(path, defaultValue)`
- `getList(path, defaultValue)`
- `forEach(path, callback)`, iterate particular path of value, then call the callback function. The callback function receive three parameter`(value, key, config)`:one for value, one for key(index for array), the last one is the whole object that found. If nothing is found with the path, the callback will not be called.
- `getContent()`, get the string content.
- `getValue()`, get the object that store the data.

## LICENSE

MIT
