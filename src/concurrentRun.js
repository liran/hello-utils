const isArray = require('./isArray');

/**
 * Run multiple tasks concurrently
 * @param {*} arrayOrFunc
 * @param {*} call
 * @param {*} concurrentCount
 * @returns Resolve after all tasks have finished
 */
function concurrentRun(arrayOrFunc, call, concurrentCount = 6) {
  return new Promise(async (resolve, reject) => {
    const isarray = isArray(arrayOrFunc);
    let counter = 0;
    let index = 0;

    const run = async (task) => {
      try {
        counter++;
        await call(task);
        counter--;

        // next task
        const nextTask = isarray ? arrayOrFunc[index++] : await arrayOrFunc();
        if (nextTask || nextTask === 0) {
          run(nextTask);
          return;
        }

        if (counter === 0) resolve();
      } catch (error) {
        reject(error);
      }
    };

    try {
      for (; index < concurrentCount; index++) {
        const task = isarray ? arrayOrFunc[index] : await arrayOrFunc();
        if (!task && task !== 0) break;
        run(task);
      }
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = concurrentRun;
