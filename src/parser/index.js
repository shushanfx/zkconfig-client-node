const MAP = {};

const register = function (key, parserFactory) {
  if (typeof parserFactory === "function") {
    MAP[key] = parserFactory;
  }
}

register('json', function (options) {
  let Parser = require('./JsonParser');
  return new Parser(options);
});
register('properties', function (options) {
  let Parser = require('./PropertiesParser');
  return new Parser(options);
});

module.exports.register = register;
module.exports.has = function (key) {
  return !!MAP[key];
};
module.exports.get = function (key) {
  let factory = MAP[key];
  return factory;
}
module.exports.keys = function () {
  return Object.keys(MAP);
}