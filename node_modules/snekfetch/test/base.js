/* global test expect */

const Snekfetch = require('../');

const server = require('./server');

function makeTestObj({ unicode = true, numbers = false } = {}) {
  const test = {
    Hello: 'world',
    Test: numbers ? 1337 : '1337',
  };
  if (unicode) test.Unicode = '( ͡° ͜ʖ ͡°)';
  return {
    test,
    check: (obj) => {
      expect(obj).not.toBeUndefined();
      expect(obj.Hello).toBe(test.Hello);
      expect(obj.Test).toBe(test.Test);
      if (test.Unicode) expect(obj.Unicode).toBe(test.Unicode);
    },
  };
}

test('should return a promise', () => {
  expect(Snekfetch.get('https://httpbin.org/get').end())
    .toBeInstanceOf(Promise);
});

test('should reject with error on network failure', () => {
  const invalid = 'http://localhost:6969';
  /* https://gc.gy/❥ȗ.png
   return expect(Snekfetch.get(invalid).end())
    .rejects.toBeInstanceOf(Error);*/
  return Snekfetch.get(invalid).catch((err) => {
    expect(err.name).toMatch(/(Fetch)?Error/);
  });
});

test('should resolve on success', () =>
  Snekfetch.get('https://httpbin.org/anything').then((res) => {
    expect(res.body.method).toBe('GET');
    expect(res.status).toBe(200);
    expect(res.ok).toBe(true);
    expect(res).toHaveProperty('text');
    expect(res).toHaveProperty('body');
  })
);

test('end should work', () =>
  Snekfetch.get('https://httpbin.org/anything').end((err, res) => {
    expect(err).toBe(null);
    expect(res.body).not.toBeUndefined();
  })
);

test('should reject if response is not between 200 and 300', () =>
  Snekfetch.get('https://httpbin.org/404').catch((err) => {
    expect(err.status).toBe(404);
    expect(err.ok).toBe(false);
  })
);

test('unzipping works', () =>
  Snekfetch.get('https://httpbin.org/gzip')
    .then((res) => {
      expect(res.body).not.toBeUndefined();
      expect(res.body.gzipped).toBe(true);
    })
);

test('query should work', () => {
  const { test, check } = makeTestObj();
  return Snekfetch.get('https://httpbin.org/get?inline=true')
    .query(test)
    .then((res) => {
      const { args } = res.body;
      check(args);
      expect(args.inline).toBe('true');
    });
});

test('set should work', () => {
  const { test, check } = makeTestObj({ unicode: false });
  return Snekfetch.get('https://httpbin.org/get')
    .set(test)
    .then((res) => check(res.body.headers));
});

test('attach should work', () => {
  const { test, check } = makeTestObj();
  return Snekfetch.post('https://httpbin.org/post')
    .attach(test)
    .then((res) => check(res.body.form));
});

test('send should work with json', () => {
  const { test, check } = makeTestObj({ numbers: true });
  return Snekfetch.post('https://httpbin.org/post')
    .send(test)
    .then((res) => check(res.body.json));
});

test('send should work with urlencoded', () => {
  const { test, check } = makeTestObj();
  return Snekfetch.post('https://httpbin.org/post')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send(test)
    .then((res) => check(res.body.form));
});

test('invalid json is just text', () =>
  Snekfetch.get(`http://localhost:${server.port}/invalid-json`)
    .then((res) => {
      expect(res.body).toBe('{ "a": 1');
    })
);

test('x-www-form-urlencoded response body', () =>
  Snekfetch.get(`http://localhost:${server.port}/form-urlencoded`)
    .then((res) => {
      const { body } = res;
      expect(body.test).toBe('1');
      expect(body.hello).toBe('world');
    })
);

test('redirects', () =>
  Snekfetch.get('https://httpbin.org/redirect/1')
    .then((res) => {
      expect(res.body).not.toBeUndefined();
      expect(res.body.url).toBe('https://httpbin.org/get');
    })
);
