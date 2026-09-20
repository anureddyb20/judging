// ==============================================================================
// API CLIENT
// ==============================================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApiClient {
  constructor(baseUrl = API_BASE) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config = {
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

  async get(endpoint, params) {
    const searchParams = params ? new URLSearchParams(params).toString() : '';
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  async getPaginated(endpoint, page = 1, pageSize = 20, params) {
    const queryParams = {
      page: String(page),
      pageSize: String(pageSize),
      ...params,
    };
    return this.get(endpoint, queryParams);
  }
}

export const apiClient = new ApiClient();

export const teamsApi = {
  list: (params) => apiClient.get('/teams', params),
  get: (id) => apiClient.get(`/teams/${id}`),
  create: (data) => apiClient.post('/teams', data),
  update: (id, data) => apiClient.put(`/teams/${id}`, data),
  delete: (id) => apiClient.delete(`/teams/${id}`),
};

export const evaluationsApi = {
  list: (params) => apiClient.get('/evaluations', params),
  get: (id) => apiClient.get(`/evaluations/${id}`),
  create: (data) => apiClient.post('/evaluations', data),
  update: (id, data) => apiClient.put(`/evaluations/${id}`, data),
};

export const scoringApi = {
  calculate: (data) => apiClient.post('/score/calculate', data),
  aggregate: (teamId, data) => apiClient.post(`/score/aggregate/${teamId}`, data),
};

export const adminApi = {
  getSettings: () => apiClient.get('/admin/settings'),
  updateSettings: (data) => apiClient.put('/admin/settings', data),
  getAuditLogs: (params) => apiClient.get('/admin/audit', params),
  getAssignments: () => apiClient.get('/admin/assignments'),
  createAssignment: (data) => apiClient.post('/admin/assignments', data),
  deleteAssignment: (id) => apiClient.delete(`/admin/assignments/${id}`),
};

export const missionsApi = {
  list: () => apiClient.get('/missions'),
  get: (id) => apiClient.get(`/missions/${id}`),
};

export const judgesApi = {
  list: () => apiClient.get('/judges'),
  get: (id) => apiClient.get(`/judges/${id}`),
};

export const submissionsApi = {
  list: (params) => apiClient.get('/submissions', params),
  get: (teamId) => apiClient.get(`/submissions/${teamId}`),
  create: (data) => apiClient.post('/submissions', data),
  update: (teamId, data) => apiClient.put(`/submissions/${teamId}`, data),
};