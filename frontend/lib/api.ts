const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  async request(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  get: (path: string) => api.request(path),
  post: (path: string, body: any) => api.request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path: string, body: any) => api.request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path: string) => api.request(path, { method: 'DELETE' }),
};