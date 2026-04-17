import axios from 'axios';
import type { TokenResponse, Room, RoomCreate, ChatMessage, User } from '../types';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: BASE });

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const authApi = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post<TokenResponse>('/api/auth/register', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post<TokenResponse>('/api/auth/login', data).then((r) => r.data),
};

// Rooms
export const roomsApi = {
  list: () => api.get<Room[]>('/api/rooms').then((r) => r.data),

  get: (id: string) => api.get<Room>(`/api/rooms/${id}`).then((r) => r.data),

  create: (data: RoomCreate) =>
    api.post<Room>('/api/rooms', data).then((r) => r.data),

  update: (id: string, data: Partial<Room>) =>
    api.patch<Room>(`/api/rooms/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/api/rooms/${id}`),

  messages: (id: string) =>
    api.get<ChatMessage[]>(`/api/rooms/${id}/messages`).then((r) => r.data),
};

export default api;
