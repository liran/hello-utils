const isArray = (o) => Object.prototype.toString.call(o) === '[object Array]';

module.exports = isArray;
