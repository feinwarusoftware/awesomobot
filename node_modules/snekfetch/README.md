[![npm][download-badge]][npm]
[![David][dep-badge]][dep-link]
[![Coverage Status][coverage-badge]][coverage-link]
[![Build Status][build-badge]][build-link]

[![NPM][large-badge]][stats-link]

# snekfetch <sup>[![Version Badge][version-badge]][npm]</sup>

Snekfetch is a fast, efficient, and user-friendly library for making HTTP requests.

The API was inspired by superagent, however it is much smaller and faster.
In fact, in browser, it is a mere 4.8kb.

Documentation is available at https://snekfetch.js.org/

## Some examples

```javascript
const snekfetch = require('snekfetch');

snekfetch.get('https://s.gus.host/o-SNAKES-80.jpg')
  .then(r => fs.writeFile('download.jpg', r.body));

snekfetch.get('https://s.gus.host/o-SNAKES-80.jpg')
  .pipe(fs.createWriteStream('download.jpg'));
```

```javascript
const snekfetch = require('snekfetch');

snekfetch.post('https://httpbin.org/post')
  .send({ meme: 'dream' })
  .then(r => console.log(r.body));
```

[npm]: https://npmjs.org/package/snekfetch
[large-badge]: https://nodei.co/npm/snekfetch.png?downloads=true&downloadRank=true&stars=true
[stats-link]: https://nodei.co/npm/snekfetch/
[version-badge]: http://versionbadg.es/devsnek/snekfetch.svg
[download-badge]: https://img.shields.io/npm/dt/snekfetch.svg?maxAge=3600
[build-badge]: https://api.travis-ci.org/devsnek/snekfetch.svg?branch=master
[build-link]: https://travis-ci.org/devsnek/snekfetch
[dep-badge]: https://david-dm.org/guscaplan/snekfetch.svg
[dep-link]: https://david-dm.org/guscaplan/snekfetch
[coverage-badge]: https://coveralls.io/repos/github/devsnek/snekfetch/badge.svg?branch=master
[coverage-link]: https://coveralls.io/github/devsnek/snekfetch?branch=master
