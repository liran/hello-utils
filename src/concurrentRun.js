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
    const isarray = isArray(arrayOrFunc);
    let counter = 0;
    let index = 0;

    const run = async (task) => {
      counter++;
      await call(task);
      counter--;

      // next task
      const nextTask = isarray ? arrayOrFunc[index++] : arrayOrFunc();
      if (nextTask || nextTask === 0) {
        run(nextTask);
        return;
      }

      if (counter === 0) resolve();
    };

    for (; index < concurrentCount; index++) {
      const task = isarray ? arrayOrFunc[index] : arrayOrFunc();
      if (!task && task !== 0) break;
      run(task);
    }
  });
}

module.exports = concurrentRun;
