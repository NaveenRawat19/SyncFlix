import { io, Socket } from 'socket.io-client';
import type {
  SyncState,
  ViewerInfo,
  ChatMessage,
  ReactionEvent,
} from '../types';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8000';

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (this.socket?.connected) return this.socket;
    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  get instance(): Socket | null {
    return this.socket;
  }

  // ── Emitters ─────────────────────────────────────────────────
  joinRoom(payload: {
    room_id: string;
    user_id: string;
    username: string;
    avatar_color: string;
  }) {
    this.socket?.emit('join_room', payload);
  }

  leaveRoom(room_id: string) {
    this.socket?.emit('leave_room', { room_id });
  }

  play(room_id: string, position: number) {
    this.socket?.emit('player_play', { room_id, position });
  }

  pause(room_id: string, position: number) {
    this.socket?.emit('player_pause', { room_id, position });
  }

  seek(room_id: string, position: number) {
    this.socket?.emit('player_seek', { room_id, position });
  }

  requestSync(room_id: string) {
    this.socket?.emit('request_sync', { room_id });
  }

  sendChat(payload: {
    room_id: string;
    user_id: string;
    username: string;
    avatar_color: string;
    text: string;
  }) {
    this.socket?.emit('chat_message', payload);
  }

  sendReaction(payload: { room_id: string; emoji: string; username: string }) {
    this.socket?.emit('reaction', payload);
  }

  // ── Listeners ─────────────────────────────────────────────────
  onSyncState(cb: (data: SyncState) => void) {
    this.socket?.on('sync_state', cb);
    return () => this.socket?.off('sync_state', cb);
  }

  onPlay(cb: (data: { position: number }) => void) {
    this.socket?.on('player_play', cb);
    return () => this.socket?.off('player_play', cb);
  }

  onPause(cb: (data: { position: number }) => void) {
    this.socket?.on('player_pause', cb);
    return () => this.socket?.off('player_pause', cb);
  }

  onSeek(cb: (data: { position: number }) => void) {
    this.socket?.on('player_seek', cb);
    return () => this.socket?.off('player_seek', cb);
  }

  onViewerJoined(cb: (data: { user: ViewerInfo; viewers: ViewerInfo[]; viewer_count: number }) => void) {
    this.socket?.on('viewer_joined', cb);
    return () => this.socket?.off('viewer_joined', cb);
  }

  onViewerLeft(cb: (data: { sid: string; viewers: ViewerInfo[]; viewer_count: number }) => void) {
    this.socket?.on('viewer_left', cb);
    return () => this.socket?.off('viewer_left', cb);
  }

  onChatBroadcast(cb: (msg: ChatMessage) => void) {
    this.socket?.on('chat_broadcast', cb);
    return () => this.socket?.off('chat_broadcast', cb);
  }

  onReactionBroadcast(cb: (data: ReactionEvent) => void) {
    this.socket?.on('reaction_broadcast', cb);
    return () => this.socket?.off('reaction_broadcast', cb);
  }
}

export const socketService = new SocketService();
