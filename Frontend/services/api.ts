import { getStableDeviceId } from "./deviceService";

const API_BASE_URL = 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

const getHeaders = async (customHeaders: Record<string, string> = {}): Promise<Record<string, string>> => {
  const deviceId = await getStableDeviceId();
  return {
    'Content-Type': 'application/json',
    'device-id': deviceId,
    ...customHeaders,
  };
};

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },

  post: async <T>(endpoint: string, body: any, isMultipart = false): Promise<T> => {
    let headers = await getHeaders();
    
    if (isMultipart) {
        // Let browser set Content-Type for FormData
        delete headers['Content-Type'];
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: isMultipart ? body : JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }
    return response.json();
  }
};
