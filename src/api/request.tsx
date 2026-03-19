/**
 * Re-exports the REST API client from request.ts.
 * Use: import { get, post, put, patch, del } from '../api/request';
 * Or: import request from '../api/request';
 */
export {
  get,
  post,
  put,
  patch,
  del,
  setBaseURL,
  getBaseURL,
  type RequestConfig,
  type ApiError,
} from './request';

import request from './request';
export default request;
