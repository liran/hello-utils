const isArray = require('./isArray');

/**
 * Run multiple tasks concurrently
 * @param {*} arrayOrFunc
 * @param {*} call
 * @param {*} concurrentCount
 * @returns Resolve after all tasks have finished
 */
function concurrentRun(arrayOrFunc, call, concurrentCount = 6) {
  return new Promise((resolve) => {
    const b = isArray(arrayOrFunc);
    let counter = 0;
    let index = 0;

    const run = async (task) => {
      counter++;
      await call(task);
      if (--counter === 0) return resolve();

      // next task
      const nextTask = b ? arrayOrFunc[++index] : arrayOrFunc();
      if (nextTask) run(nextTask);
    };

    for (; index < concurrentCount; index++) {
      const a = isArray ? arrayOrFunc[index] : arrayOrFunc();
      if (!a) break;
      run(a);
    }
  });
}

module.exports = concurrentRun;
