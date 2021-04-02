// const concurrentCount = require('../src/concurrentRun');

// test('concurrentCount: 1', async (done) => {
//   // 1 concurrent
//   let sum = 0;
//   await concurrentCount(
//     [1, 2, 3, 4, 5, 6],
//     (val) => {
//       sum += val;
//     },
//     1
//   );
//   expect(sum).toBe(21);

//   done();
// });

// test('concurrentCount: 3', async (done) => {
//   // 3 concurrent
//   let sum = 0;
//   await concurrentCount(
//     [1, 2, 3, 4, 5, 6],
//     (val) => {
//       sum += val;
//     },
//     3
//   );
//   expect(sum).toBe(21);

//   done();
// });

// test('concurrentCount: func', async (done) => {
//   const array = [1, 2, 3, 4, 5, 6];
//   let sum = 0;
//   await concurrentCount(
//     () => array.shift(),
//     (val) => {
//       sum += val;
//     },
//     2
//   );
//   expect(sum).toBe(21);

//   done();
// });
