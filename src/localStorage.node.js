const LocalStorage = require('node-localstorage').LocalStorage;

const totalQuota = 1024 * 1024 * 1024 * 1024; // 1TB
let localStorage;

function config(location = '/tmp/localdb', quota = totalQuota) {
  localStorage = new LocalStorage(location, quota);
}

function setItem(key, val) {
  if (!localStorage) config();

  try {
    if (val === null) {
      localStorage.removeItem(key);
    } else {
      const value = JSON.stringify(val);
      localStorage.setItem(key, value);
    }
    return true;
  } catch (e) {
    return false;
  }
}

function getItem(key) {
  if (!localStorage) config();

  let value = localStorage.getItem(key);
  try {
    value = JSON.parse(value);
    // eslint-disable-next-line no-empty
  } catch (e) {}

  return value;
}

function remove(key) {
  if (!localStorage) config();

  localStorage.removeItem(key);
}

function clear() {
  localStorage.clear();
}

module.exports = { config, setItem, getItem, remove, clear };
