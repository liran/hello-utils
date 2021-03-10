async function retryRun(call, retry = 10) {
  for (let i = 0; i < retry; i++) {
    if (await call(i)) return true;
  }
  return false;
}

module.exports = retryRun;
