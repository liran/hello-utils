const fetch = require('../src/fetch.node');

// test('fetch baidu', async (done) => {
//   const res = await fetch('http://www.baidu.com');
//   expect(res.isOK).toBe(true);

//   done();
// });

// test('fetch google', async (done) => {
//   const proxy = 'http://localhost:1080';
//   const res = await fetch('https://www.google.com', { proxy });
//   expect(res.isOK).toBe(true);

//   done();
// });

async function run() {
  // const proxy = 'http://localhost:1080';
  const res = await fetch('https://www.dhgate.com');
  console.log(res.isOK);
}

run();
