const https = require('https');
const url = require('url');
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');
const { AbortController } = require('abort-controller');
const sleep = require('./sleep');
const Cookie = require('./cookie');
const singleJoiningSlash = require('./singleJoiningSlash');

const nodeFetch = async (link, options = {}) => {
  // https://github.com/node-fetch/node-fetch#options
  // Use an insecure HTTP parser that accepts invalid HTTP headers when `true`.
  options.insecureHTTPParser = true;
  options.highWaterMark = 1048576; // 1 MB

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
    // https://github.com/TooTallNate/node-https-proxy-agent/issues/11#issuecomment-190369376
    const opts = url.parse(options.proxy);
    opts.rejectUnauthorized = false;
    options.agent = new HttpsProxyAgent(opts);
    delete options.proxy;
  } else if (url.parse(link).protocol === 'https:') {
    // https://github.com/node-fetch/node-fetch/issues/15#issuecomment-533869809
    options.agent = new https.Agent({ rejectUnauthorized: false });
  }

  // The default redirection is without cookies, we need to handle the redirection manually
  const redirect = options.redirect;
  options.redirect = 'manual';

  options.headers = {
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
    ...(options?.headers || {}),
  };
  const cookie = options.headers.cookie;

  let res;
  const lastIndex = retry - 1;
  const cookier = new Cookie();
  let errorMsg = 'network error';
  for (let i = 0; i < retry; i++) {
    try {
      cookier.reset(cookie);
      let redirectLink = link;
      for (let redirectCount = 0; redirectCount < 20; redirectCount++) {
        const controller = new AbortController();
        options.signal = controller.signal;
        const timer = setTimeout(() => controller.abort(), timeout);
        options.headers.cookie = cookier.cookie;
        res = await fetch(redirectLink, options);
        cookier.merge(res);
        clearTimeout(timer);
        if ((!redirect || redirect === 'follow') && res.status >= 300 && res.status < 400) {
          redirectLink = res.headers.get('location');
          if (!/^https?:\/\//.test(redirectLink)) {
            redirectLink = singleJoiningSlash(new URL(link).origin, redirectLink);
          }
          continue;
        }
        break;
      }

      // The original OK is between 200–299
      // If you use the parameter redirect: 'manual', 300 to 399 should also be OK
      // So we need to manually adjust it to fit our real usage scenarios
      res.isOk = res.isOK = res.status >= 200 && res.status < 400;
      if (!res.isOK && i !== lastIndex) throw Error(`${res.status}, ${res.statusText}`);

      // append cookier
      res.cookie = cookier.cookie;

      break;
    } catch (error) {
      const message = error.type === 'aborted' ? 'Request timeout' : error.message;
      console.log('Fetch error:', message);
      errorMsg = message;
      await sleep(sleepTime);
    }
  }

  return res || { isOK: false, status: 0, statusText: errorMsg };
};

module.exports = nodeFetch;
