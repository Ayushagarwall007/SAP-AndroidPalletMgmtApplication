/**
 * Central REST API client for all HTTP requests.
 * Use get, post, put, patch, delete for typed requests.
 */

const DEFAULT_TIMEOUT_MS = 30000;

export interface RequestConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

const defaultBaseURL = ''; // Set via setBaseURL or env, e.g. 'https://api.example.com'

let baseURL = defaultBaseURL;

export function setBaseURL(url: string) {
  baseURL = url.replace(/\/$/, '');
}

export function getBaseURL(): string {
  return baseURL;
}

function buildURL(path: string, config?: RequestConfig): string {
  const pathNorm = path.startsWith('/') ? path : `/${path}`;
  const urlBase = config?.baseURL ?? baseURL;
  if (!urlBase) return pathNorm;
  return `${urlBase.replace(/\/$/, '')}${pathNorm}`;
}

function defaultHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

function mergeHeaders(config?: RequestConfig): Record<string, string> {
  return { ...defaultHeaders(), ...config?.headers };
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (!response.ok) {
    let data: unknown;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch {
      data = undefined;
    }
    const error: ApiError = {
      message: response.statusText || `HTTP ${response.status}`,
      status: response.status,
      data,
    };
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  try {
    return isJson ? await response.json() : ((await response.text()) as unknown as T);
  } catch {
    return undefined as T;
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Request timeout')), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

async function request<T>(
  method: string,
  path: string,
  options?: {
    body?: unknown;
    config?: RequestConfig;
  }
): Promise<T> {
  const { body, config } = options ?? {};
  const url = buildURL(path, config);
  const headers = mergeHeaders(config);
  const timeout = config?.timeout ?? DEFAULT_TIMEOUT_MS;

  const init: RequestInit = {
    method,
    headers,
  };

  if (body !== undefined && body !== null && method !== 'GET') {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const promise = fetch(url, init).then(handleResponse<T>);
  return withTimeout(promise, timeout);
}

/** GET request */
export function get<T = unknown>(path: string, config?: RequestConfig): Promise<T> {
  return request<T>('GET', path, { config });
}

/** POST request */
export function post<T = unknown>(
  path: string,
  body?: unknown,
  config?: RequestConfig
): Promise<T> {
  return request<T>('POST', path, { body, config });
}

/** PUT request */
export function put<T = unknown>(
  path: string,
  body?: unknown,
  config?: RequestConfig
): Promise<T> {
  return request<T>('PUT', path, { body, config });
}

/** PATCH request */
export function patch<T = unknown>(
  path: string,
  body?: unknown,
  config?: RequestConfig
): Promise<T> {
  return request<T>('PATCH', path, { body, config });
}

/** DELETE request */
export function del<T = unknown>(path: string, config?: RequestConfig): Promise<T> {
  return request<T>('DELETE', path, { config });
}

export default {
  setBaseURL,
  getBaseURL,
  get,
  post,
  put,
  patch,
  del,
};
