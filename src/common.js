const fs = require('fs');

module.exports = {};

fs.readdirSync(__dirname, { withFileTypes: true }).forEach((item) => {
  if (/^\w+(?:\.js)$/.test(item.name) && !/(?:browser|common|node).js/.test(item.name)) {
    const name = item.name.replace('.js', '');
    module.exports[name] = require(`./${item.name}`);
  }
});
