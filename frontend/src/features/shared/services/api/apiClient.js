// ==============================================================================
// VICEVERSE API CLIENT
// ==============================================================================

import { ApiResponse, PaginatedResponse } from '@/features/shared/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Request failed' };
      }
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const searchParams = params ? new URLSearchParams(params).toString() : '';
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Paginated requests
  async getPaginated<T>(
    endpoint: string,
    page: number = 1,
    pageSize: number = 20,
    params?: Record<string, string>
  ): Promise<PaginatedResponse<T>> {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...params,
    });
    return this.request<T[]>(`${endpoint}?${searchParams.toString()}`);
  }
}

export const apiClient = new ApiClient();

// Specific API methods
export const teamsApi = {
  list: (params?: { status?: string }) => apiClient.get('/teams', params),
  get: (id: string) => apiClient.get(`/teams/${id}`),
  create: (data: unknown) => apiClient.post('/teams', data),
  update: (id: string, data: unknown) => apiClient.put(`/teams/${id}`, data),
  delete: (id: string) => apiClient.delete(`/teams/${id}`),
};

export const evaluationsApi = {
  list: (params?: { teamId?: string; judgeId?: string }) => apiClient.get('/evaluations', params),
  get: (id: string) => apiClient.get(`/evaluations/${id}`),
  create: (data: unknown) => apiClient.post('/evaluations', data),
  update: (id: string, data: unknown) => apiClient.put(`/evaluations/${id}`, data),
};

export const scoreApi = {
  calculate: (data: unknown) => apiClient.post('/score/calculate', data),
  aggregate: (teamId: string, data: unknown) => apiClient.post(`/score/aggregate/${teamId}`, data),
};

export const settingsApi = {
  get: () => apiClient.get('/admin/settings'),
  update: (data: unknown) => apiClient.put('/admin/settings', data),
};

export const healthApi = {
  check: () => apiClient.get('/health'),
};

export const missionsApi = {
  list: () => apiClient.get('/missions'),
  get: (id: string) => apiClient.get(`/missions/${id}`),
};

export const judgesApi = {
  list: () => apiClient.get('/judges'),
  get: (id: string) => apiClient.get(`/judges/${id}`),
};

export const submissionsApi = {
  list: (params?: { status?: string }) => apiClient.get('/submissions', params),
  get: (teamId: string) => apiClient.get(`/submissions/${teamId}`),
  create: (data: unknown) => apiClient.post('/submissions', data),
  update: (teamId: string, data: unknown) => apiClient.put(`/submissions/${teamId}`, data),
};