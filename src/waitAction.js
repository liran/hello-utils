function waitAction(call, timeout = 20000) {
  return new Promise(async (resolve, reject) => {
    const timer = setTimeout(() => {
      const error = new Error('action timeout');
      error.type = 'timeout';
      reject(error);
    }, timeout);
    const data = await call();
    clearTimeout(timer);
    resolve(data);
  });
}

module.exports = waitAction;
