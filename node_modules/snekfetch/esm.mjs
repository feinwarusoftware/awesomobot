import Snekfetch from './index.js';

export default Snekfetch;

export const get = Snekfetch.get;
export const head = Snekfetch.head;
export const post = Snekfetch.post;
export const put = Snekfetch.put;
const delete_ = Snekfetch.delete;
export { delete_ as delete };
export const connect = Snekfetch.connect;
export const options = Snekfetch.options;
export const patch = Snekfetch.patch;
