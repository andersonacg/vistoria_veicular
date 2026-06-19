const BASE_URL = process.env.API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export const api = {
  getVistorias: () => request<unknown[]>('/vistorias'),
  getVistoria: (id: string) => request<unknown>(`/vistorias/${id}`),
  criarVistoria: (data: unknown) =>
    request<unknown>('/vistorias', { method: 'POST', body: JSON.stringify(data) }),
  atualizarVistoria: (id: string, data: unknown) =>
    request<unknown>(`/vistorias/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};
