const fs = require('fs');
const path = require('path');

const userDirectory = process.env['USERPROFILE'] || process.env['HOME'] || '';
const homeDirectory = userDirectory ? path.resolve(userDirectory, './.zkconfig') :
  path.resolve(process.cwd(), './.zkconfig');
let isExistOrNot = false;

const guaranteeDirectory = function () {
  if (isExistOrNot) {
    return true;
  }
  let isExits = fs.existsSync(homeDirectory);
  if (!isExits) {
    isExistOrNot = true;
    fs.mkdirSync(homeDirectory);
  } else {
    isExistOrNot = true;
  }
}
module.exports.getCache = function (key, callback) {
  guaranteeDirectory();
  let newPath = path.resolve(homeDirectory, key);
  if (newPath) {
    fs.exists(newPath, function (exists) {
      if (exists) {
        fs.readFile(newPath, {
          encoding: 'utf-8'
        }, function (err, data) {
          if (err) {
            callback && callback(null);
          } else {
            callback && callback(data);
          }
        });
      } else {
        callback && callback(null);
      }
    })
  }
}

module.exports.setCache = function (key, value, callback) {
  guaranteeDirectory();
  let newPath = path.resolve(homeDirectory, key);
  fs.writeFile(newPath, value, {
    encoding: 'utf-8'
  }, function (err) {
    if (err) {
      callback && callback(null);
    } else {
      callback && callback(true);
    }
  })
}