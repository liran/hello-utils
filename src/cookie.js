function merge(...args) {
  const all = {};
  args.forEach((c) => {
    `${c}`.split(';').forEach((line) => {
      const keyval = line.split('=');
      if (keyval.length === 2) all[keyval[0]] = keyval[1];
    });
  });

  let cookie = '';
  for (const key in all) {
    const val = all[key];
    if (cookie) cookie += ';';
    cookie += `${key}=${val}`;
  }

  return cookie;
}

class Cookie {
  cookie = '';

  reset = (cookie) => {
    if (cookie) return (this.cookie = cookie);
    this.cookie = '';
  };

  merge = (res) => {
    const originCookie = res?.headers?.raw()['set-cookie'];
    if (!originCookie) return;
    const cookie = originCookie.map((item) => item.split(';')[0]).join(';');
    if (cookie) this.cookie = merge(this.cookie, cookie);
  };
}

module.exports = Cookie;
