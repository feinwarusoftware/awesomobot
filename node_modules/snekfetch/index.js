const Snekfetch = require('./src/index.js');

// const ENV_VAR = '__SNEKFETCH_SYNC_REQUEST';
// let first = true;
//
// for (let method of Snekfetch.METHODS) {
//   method = method === 'M-SEARCH' ? 'msearch' : method.toLowerCase();
//   Snekfetch[`${method}Sync`] = (url, options = {}) => {
//     if (first) {
//       first = false;
//       console.error(
//         'Performing sync requests is a really stupid thing to do. ' +
//         'https://www.google.com/search?q=why+sync+requests+are+bad+nodejs'
//       );
//     }
//     options.url = url;
//     options.method = method;
//     const cp = require('child_process');
//     const result = JSON.parse(
//       cp.execSync(`node ${__dirname}/index.js`, {
//         env: { [ENV_VAR]: JSON.stringify(options) },
//       }).toString(),
//       (k, v) => {
//         if (v === null) return v;
//         if (v.type === 'Buffer' && Array.isArray(v.data)) return new Buffer(v.data);
//         if (v.__CONVERT_TO_ERROR) {
//           const e = new Error();
//           for (const key of Object.keys(v)) {
//             if (key === '__CONVERT_TO_ERROR') continue;
//             e[key] = v[key];
//           }
//           return e;
//         }
//         return v;
//       }
//     );
//     if (result.error) throw result.error;
//     return result;
//   };
// }
//
// if (process.env[ENV_VAR]) {
//   const options = JSON.parse(process.env[ENV_VAR]);
//   const request = Snekfetch[options.method](options.url);
//   if (options.headers) request.set(options.headers);
//   if (options.body) request.send(options.body);
//   request.end((err, res = {}) => {
//     if (err) {
//       const alt = {};
//       for (const name of Object.getOwnPropertyNames(err)) alt[name] = err[name];
//       res.error = alt;
//       res.error.__CONVERT_TO_ERROR = true;
//     }
//     // circulars
//     res.request = null;
//     process.stdout.write(JSON.stringify(res));
//   });
// }

module.exports = Snekfetch;
