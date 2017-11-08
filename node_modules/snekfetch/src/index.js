require('stream');
const zlib = require('zlib');
const qs = require('querystring');
const http = require('http');
const https = require('https');
const URL = require('url');
const Package = require('../package.json');
const Stream = require('stream');
const FormData = require('./FormData');

class Snekfetch extends Stream.Readable {
  constructor(method, url, opts = { headers: {}, data: null }) {
    super();

    const options = URL.parse(url);
    options.method = method.toUpperCase();
    options.headers = opts.headers;
    this.data = opts.data;

    this.request = (options.protocol === 'https:' ? https : http).request(options);
  }

  query(name, value) {
    if (this.request.res) throw new Error('Cannot modify query after being sent!');
    if (!this.request.query) this.request.query = {};
    if (name !== null && typeof name === 'object') {
      this.request.query = Object.assign(this.request.query, name);
    } else {
      this.request.query[name] = value;
    }
    return this;
  }

  set(name, value) {
    if (this.request.res) throw new Error('Cannot modify headers after being sent!');
    if (name !== null && typeof name === 'object') {
      for (const key of Object.keys(name)) this.set(key, name[key]);
    } else {
      this.request.setHeader(name, value);
    }
    return this;
  }

  attach(name, data, filename) {
    if (this.request.res) throw new Error('Cannot modify data after being sent!');
    const form = this._getFormData();
    this.set('Content-Type', `multipart/form-data; boundary=${form.boundary}`);
    form.append(name, data, filename);
    this.data = form;
    return this;
  }

  send(data) {
    if (this.request.res) throw new Error('Cannot modify data after being sent!');
    if (data !== null && typeof data === 'object') {
      const header = this._getHeader('content-type');
      let serialize;
      if (header) {
        if (header.includes('json')) serialize = JSON.stringify;
        else if (header.includes('urlencoded')) serialize = qs.stringify;
      } else {
        this.set('Content-Type', 'application/json');
        serialize = JSON.stringify;
      }
      this.data = serialize(data);
    } else {
      this.data = data;
    }
    return this;
  }

  then(resolver, rejector) {
    return new Promise((resolve, reject) => {
      const request = this.request;

      const handleError = (err) => {
        if (!err) err = new Error('Unknown error occured');
        err.request = request;
        reject(err);
      };

      request.on('abort', handleError);
      request.on('aborted', handleError);
      request.on('error', handleError);

      request.on('response', (response) => {
        const stream = new Stream.PassThrough();
        if (this._shouldUnzip(response)) {
          response.pipe(zlib.createUnzip({
            flush: zlib.Z_SYNC_FLUSH,
            finishFlush: zlib.Z_SYNC_FLUSH,
          })).pipe(stream);
        } else {
          response.pipe(stream);
        }

        let body = [];

        stream.on('data', (chunk) => {
          if (!this.push(chunk)) this.pause();
          body.push(chunk);
        });

        stream.on('end', () => {
          this.push(null);
          const concated = Buffer.concat(body);

          if (this._shouldRedirect(response)) {
            let method = this.request.method;
            if ([301, 302].includes(response.statusCode)) {
              if (method !== 'HEAD') method = 'GET';
              this.data = null;
            } else if (response.statusCode === 303) {
              method = 'GET';
            }

            const headers = {};
            if (this.request._headerNames) {
              for (const name of Object.keys(this.request._headerNames)) {
                if (name.toLowerCase() === 'host') continue;
                headers[this.request._headerNames[name]] = this.request._headers[name];
              }
            } else {
              for (const name of Object.keys(this.request._headers)) {
                if (name.toLowerCase() === 'host') continue;
                const header = this.request._headers[name];
                headers[header.name] = header.value;
              }
            }

            const newURL = /^https?:\/\//i.test(response.headers.location) ?
              response.headers.location :
              URL.resolve(makeURLFromRequest(request), response.headers.location);
            resolve(new Snekfetch(method, newURL, { data: this.data, headers }));
            return;
          }

          const res = {
            request: this.request,
            body: concated,
            text: concated.toString(),
            ok: response.statusCode >= 200 && response.statusCode < 300,
            headers: response.headers,
            status: response.statusCode,
            statusText: response.statusText || http.STATUS_CODES[response.statusCode],
          };

          const type = response.headers['content-type'];
          if (type) {
            if (type.includes('application/json')) {
              try {
                res.body = JSON.parse(res.text);
              } catch (err) {} // eslint-disable-line no-empty
            } else if (type.includes('application/x-www-form-urlencoded')) {
              res.body = qs.parse(res.text);
            }
          }

          if (res.ok) {
            resolve(res);
          } else {
            const err = new Error(`${res.status} ${res.statusText}`.trim());
            Object.assign(err, res);
            reject(err);
          }
        });
      });

      this._addFinalHeaders();
      if (this.request.query) this.request.path = `${this.request.path}?${qs.stringify(this.request.query)}`;
      request.end(this.data ? this.data.end ? this.data.end() : this.data : null);
    })
    .then(resolver, rejector);
  }

  catch(rejector) {
    return this.then(null, rejector);
  }

  end(cb) {
    return this.then(
      (res) => cb ? cb(null, res) : res,
      (err) => cb ? cb(err, err.status ? err : null) : err
    );
  }

  _read() {
    this.resume();
    if (this.response) return;
    this.catch((err) => this.emit('error', err));
  }

  _shouldUnzip(res) {
    if (res.statusCode === 204 || res.statusCode === 304) return false;
    if (res.headers['content-length'] === '0') return false;
    return /^\s*(?:deflate|gzip)\s*$/.test(res.headers['content-encoding']);
  }

  _shouldRedirect(res) {
    return [301, 302, 303, 307, 308].includes(res.statusCode);
  }

  _getFormData() {
    if (!this._formData) this._formData = new FormData();
    return this._formData;
  }

  _addFinalHeaders() {
    if (!this.request) return;
    if (!this._getHeader('user-agent')) {
      this.set('User-Agent', `snekfetch/${Snekfetch.version} (${Package.repository.url.replace(/\.?git/, '')})`);
    }
    if (this.request.method !== 'HEAD') this.set('Accept-Encoding', 'gzip, deflate');
  }

  get response() {
    return this.request.res || this.request._response || null;
  }

  _getHeader(header) {
    // https://github.com/jhiesey/stream-http/pull/77
    try {
      return this.request.getHeader(header);
    } catch (err) {
      return null;
    }
  }
}

Snekfetch.version = Package.version;

Snekfetch.METHODS = http.METHODS.concat('BREW');
for (const method of Snekfetch.METHODS) {
  Snekfetch[method === 'M-SEARCH' ? 'msearch' : method.toLowerCase()] = (url) => new Snekfetch(method, url);
}

if (typeof module !== 'undefined') module.exports = Snekfetch;
else if (typeof window !== 'undefined') window.Snekfetch = Snekfetch;

function makeURLFromRequest(request) {
  return URL.format({
    protocol: request.connection.encrypted ? 'https:' : 'http:',
    hostname: request.getHeader('host'),
    pathname: request.path.split('?')[0],
    query: request.query,
  });
}
