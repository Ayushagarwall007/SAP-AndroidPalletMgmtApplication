import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ScanRecord {
  id: string;
  value: string;
  source: 'infrared' | 'camera' | 'manual';
  timestamp: number;
}

/** SAP auth data from x-csrf-token=fetch and response headers for subsequent API calls */
export interface SapAuthState {
  csrfToken: string | null;
  /** Cookie header value to send with subsequent requests (when available) */
  cookieHeader: string | null;
  /** Last time token was successfully refreshed */
  refreshedAt: number | null;
  /** Last error message if refresh failed */
  refreshError: string | null;
}

interface AppState {
  scanHistory: ScanRecord[];
  lastScan: string | null;
  isApiLoading: boolean;
  sapAuth: SapAuthState;
}

const initialSapAuth: SapAuthState = {
  csrfToken: null,
  cookieHeader: null,
  refreshedAt: null,
  refreshError: null,
};

const initialState: AppState = {
  scanHistory: [],
  lastScan: null,
  isApiLoading: false,
  sapAuth: initialSapAuth,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addScan: (state, action: PayloadAction<{ value: string; source: ScanRecord['source'] }>) => {
      const { value, source } = action.payload;
      const record: ScanRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        value,
        source,
        timestamp: Date.now(),
      };
      state.scanHistory.unshift(record);
      state.scanHistory = state.scanHistory.slice(0, 50);
      state.lastScan = value;
    },
    clearScans: (state) => {
      state.scanHistory = [];
      state.lastScan = null;
    },
    setApiLoading: (state, action: PayloadAction<boolean>) => {
      state.isApiLoading = action.payload;
    },
    setSapAuth: (state, action: PayloadAction<Partial<SapAuthState>>) => {
      state.sapAuth = { ...state.sapAuth, ...action.payload };
    },
    setSapAuthSuccess: (
      state,
      action: PayloadAction<{ csrfToken: string | null; cookieHeader?: string | null }>
    ) => {
      state.sapAuth.csrfToken = action.payload.csrfToken;
      state.sapAuth.cookieHeader = action.payload.cookieHeader ?? state.sapAuth.cookieHeader;
      state.sapAuth.refreshedAt = Date.now();
      state.sapAuth.refreshError = null;
    },
    setSapAuthError: (state, action: PayloadAction<string>) => {
      state.sapAuth.refreshError = action.payload;
      state.sapAuth.refreshedAt = null;
    },
    clearSapAuth: (state) => {
      state.sapAuth = initialSapAuth;
    },
  },
});

export const {
  addScan,
  clearScans,
  setApiLoading,
  setSapAuth,
  setSapAuthSuccess,
  setSapAuthError,
  clearSapAuth,
} = appSlice.actions;
export default appSlice.reducer;
