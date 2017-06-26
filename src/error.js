const ERROR_TYPE = {
    ERROR_CONNECT: 1, // fire when connect fail.
    ERROR_READ: 2, // when read with error, such as node not exist, node remove.
    ERROR_PARSE: 4, // when parse with error, parse the content to a config instance.
    ERROR_MONITOR: 8, // monitor error, when upload the monitor information.
    ERROR_HANDLE: 16, // when handle the config instance with error.
}

class ZKConfigError extends Error {
    constructor(err, type) {
        super(err.message);
        this.err = err;
        this.type = type;
    }
}

exports = module.exports = ZKConfigError;
Object.keys(ERROR_TYPE).forEach(key => {
    ZKConfigError[key] = ERROR_TYPE[key];
});