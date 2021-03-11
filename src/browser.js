const fs = require('fs');

module.exports = require('./common');

const reg = /(?:\.browser\.js)$/;
fs.readdirSync(__dirname, { withFileTypes: true }).forEach((item) => {
  if (reg.test(item.name)) {
    const name = item.name.replace(reg, '');
    module.exports[name] = require(`./${item.name}`);
  }
});
