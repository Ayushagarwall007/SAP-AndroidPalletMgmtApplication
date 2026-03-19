/**
 * SAP OData CSRF token fetch.
 * Calls the service with x-csrf-token: fetch and returns token + cookies for later API calls.
 */

const REFRESH_TOKEN_URL =
  'https://tumc-ds4.txa.hec.ondemand.com/sap/opu/odata/sap/ZSRV_PALLET_TRANSFER_SRV/MatOffDataSet?sap-client=110&x-csrf-token=fetch';

export interface RefreshTokenResult {
  csrfToken: string | null;
  cookieHeader: string | null;
  status: number;
  /** True if response was HTML (e.g. login page) instead of OData */
  isHtmlResponse: boolean;
}

/**
 * Fetches the SAP endpoint with x-csrf-token: fetch to obtain CSRF token and session cookies.
 * Use the returned values in Redux and pass them as headers (x-csrf-token, Cookie) for subsequent OData calls.
 */
export async function refreshSapToken(): Promise<RefreshTokenResult> {
  const response = await fetch(REFRESH_TOKEN_URL, {
    method: 'GET',
    headers: {
      'x-csrf-token': 'fetch',
      Accept: 'application/json',
    },
    credentials: 'include',
  });

  const csrfToken = response.headers.get('x-csrf-token') ?? null;
  const setCookie = response.headers.get('set-cookie');
  const contentType = response.headers.get('content-type') ?? '';
  const isHtmlResponse = contentType.includes('text/html');

  return {
    csrfToken,
    cookieHeader: setCookie,
    status: response.status,
    isHtmlResponse,
  };
}
