// ── USER ──────────────────────────────────────────────────────
export interface User {
  id: string;
  username: string;
  email: string;
  avatar_color: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ── ROOM ──────────────────────────────────────────────────────
export type RoomStatus = 'live' | 'waiting' | 'ended';
export type RoomAccess = 'public' | 'private';

export interface Room {
  id: string;
  title: string;
  description: string;
  video_url: string;
  category: string;
  access: RoomAccess;
  status: RoomStatus;
  host_id: string;
  host: User;
  max_viewers: number;
  viewer_count: number;
  created_at: string;
}

export interface RoomCreate {
  title: string;
  description?: string;
  video_url?: string;
  category?: string;
  access?: RoomAccess;
  max_viewers?: number;
}

// ── CHAT ──────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  username: string;
  avatar_color: string;
  text: string;
  msg_type: 'chat' | 'reaction' | 'system';
  created_at: string;
}

// ── PLAYER ────────────────────────────────────────────────────
export interface PlayerState {
  playing: boolean;
  position: number;   // seconds
  updated_at: number; // unix timestamp
}

// ── SOCKET PAYLOADS ───────────────────────────────────────────
export interface SyncState extends PlayerState {
  viewer_count: number;
  viewers: ViewerInfo[];
}

export interface ViewerInfo {
  sid: string;
  user_id: string;
  username: string;
  avatar_color: string;
}

export interface ReactionEvent {
  emoji: string;
  username: string;
}

// ── API RESPONSES ─────────────────────────────────────────────
export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ApiError {
  detail: string;
}
