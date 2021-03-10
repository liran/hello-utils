require('regenerator-runtime/runtime');
const common = require('./common');
const fetch = require('./fetch.node');

module.exports = { ...common, fetch };
