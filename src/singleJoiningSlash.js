function singleJoiningSlash(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return '';

  const aslash = a[a.length - 1] === '/';
  const bslash = b[0] === '/';
  if (aslash && bslash) {
    return a + b.slice(1);
  }
  if (!aslash && !bslash) {
    return `${a}/${b}`;
  }
  return a + b;
}

module.exports = singleJoiningSlash;
