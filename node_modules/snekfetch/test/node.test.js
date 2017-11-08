/**
 * @jest-environment node
 */

/* global test expect */

const fs = require('fs');

const FormData = require('../src/node/FormData');
const mime = require('../src/node/mime');

const Snekfetch = require('../');

require('./base');

const resolve = (x) => require.resolve(x);

test('node/pipe get', (done) => {
  Snekfetch.get('https://httpbin.org/anything')
    .pipe(fs.createWriteStream('/dev/null'))
    .on('finish', done);
});

test('node/file get', () => {
  const original = fs.readFileSync(resolve('../package.json')).toString();
  return Snekfetch.get(`file://${resolve('../package.json')}`)
    .then((res) => {
      expect(res.text).toBe(original);
    });
});

test('node/file post', () => {
  const content = 'wow this is a\n\ntest!!';
  const file = './test_file_post.txt';
  return Snekfetch.post(`file://${file}`)
    .send(content)
    .then(() => Snekfetch.get(`file://${file}`))
    .then((res) => {
      expect(res.text).toBe(content);
    })
    .then(() => {
      fs.unlinkSync(file);
    });
});

test('node/file delete', () => {
  const file = './test_file_delete.txt';
  fs.closeSync(fs.openSync(file, 'w'));
  expect(fs.existsSync(file)).toBe(true);
  return Snekfetch.delete(`file://${file}`)
    .then(() => {
      expect(fs.existsSync(file)).toBe(false);
    });
});

test('node/FormData behaves predictably', () => {
  const f = new FormData();
  f.append('hello', 'world');
  expect(f.length).toBe(77);
});

test('node/FormData json works', () =>
  Snekfetch.post('https://httpbin.org/post')
    .attach('object', { a: 1 })
    .then((res) => {
      const { form } = res.body;
      expect(form.object).toBe('{"a":1}');
    })
);

test('node/mimes behaves predictably', () => {
  expect(mime.lookup('js')).toBe('application/javascript');
  expect(mime.lookup('nope')).toBe('application/octet-stream');
});

test('node/rawsend post', () =>
  Snekfetch.post('https://httpbin.org/post')
    .send(Buffer.from('memes')).end()
);

/*
test('node/http2', () => {
  expect(Snekfetch.get('https://http2.akamai.com/demo/tile-1.png', { version: 2 }).end())
    .resolves.toBeTruthy();
});
*/

