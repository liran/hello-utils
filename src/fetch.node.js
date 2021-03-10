const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');
const { AbortController } = require('abort-controller');
const sleep = require('./sleep');

const nodeFetch = async (url, options = {}) => {
  // Number of error retries
  let retry = 3;
  if (options.retry) {
    retry = options.retry;
    delete options.retry;
  }

  // Waiting time for request timeout, ms
  let timeout = 20000;
  if (options.timeout) {
    timeout = options.timeout;
    delete options.timeout;
  }

  // Error retry interval, ms
  let sleepTime = 1000;
  if (options.sleep) {
    sleepTime = options.sleep;
    delete options.sleep;
  }

  // Use HTTP proxy
  if (options.proxy) {
    options.agent = new HttpsProxyAgent(options.proxy);
    delete options.proxy;
  }

  let res;
  const lastIndex = retry - 1;
  for (let i = 0; i < retry; i++) {
    try {
      const controller = new AbortController();
      options.signal = controller.signal;
      const timer = setTimeout(() => controller.abort(), timeout);
      res = await fetch(url, options);
      clearTimeout(timer);

      // The original OK is between 200–299
      // If you use the parameter redirect: 'manual', 300 to 399 should also be OK
      // So we need to manually adjust it to fit our real usage scenarios
      res.isOK = res.status >= 200 && res.status < 400;
      if (!res.isOK && i !== lastIndex) throw Error(`${res.status}, ${res.statusText}`);

      break;
    } catch (error) {
      const message = error.type === 'aborted' ? 'Request timeout' : error.message;
      console.log('Fetch error:', message);
      await sleep(sleepTime);
    }
  }

  return res || { isOK: false, status: 0, statusText: 'network error' };
};

module.exports = nodeFetch;