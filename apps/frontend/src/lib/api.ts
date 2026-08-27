const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api/v1';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  login: (data: { email: string; password: string }) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  // Services
  getServices: () => apiFetch('/services'),

  getServiceBySlug: (slug: string) => apiFetch(`/services/${slug}`),

  // Availability
  getSlots: (serviceId: string, date: string) =>
    apiFetch(`/availability?serviceId=${serviceId}&date=${date}`),

  // Appointments
  createAppointment: (data: any, token?: string) =>
    apiFetch('/appointments', { method: 'POST', body: JSON.stringify(data), token }),

  getMyAppointments: (token: string) =>
    apiFetch('/appointments/me', { token }),

  getMyUpcoming: (token: string) =>
    apiFetch('/appointments/me/upcoming', { token }),

  getMyHistory: (token: string) =>
    apiFetch('/appointments/me/history', { token }),

  cancelAppointment: (id: string, token: string) =>
    apiFetch(`/appointments/${id}/cancel`, { method: 'PATCH', token }),
};
