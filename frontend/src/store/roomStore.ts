import { create } from 'zustand';
import type { Room, ChatMessage, ViewerInfo, PlayerState } from '../types';
import { roomsApi } from '../services/api';

interface RoomStore {
  rooms: Room[];
  currentRoom: Room | null;
  viewers: ViewerInfo[];
  messages: ChatMessage[];
  playerState: PlayerState;
  syncStatus: 'synced' | 'syncing' | 'desynced';
  loading: boolean;

  fetchRooms: () => Promise<void>;
  fetchRoom: (id: string) => Promise<void>;
  createRoom: (data: Partial<Room>) => Promise<Room>;
  deleteRoom: (id: string) => Promise<void>;
  updateRoomStatus: (id: string, status: Room['status']) => Promise<void>;

  setViewers: (viewers: ViewerInfo[]) => void;
  addMessage: (msg: ChatMessage) => void;
  setMessages: (msgs: ChatMessage[]) => void;
  updatePlayer: (state: Partial<PlayerState>) => void;
  setSyncStatus: (s: 'synced' | 'syncing' | 'desynced') => void;
  clearRoom: () => void;
}

export const useRoomStore = create<RoomStore>((set, get) => ({
  rooms: [],
  currentRoom: null,
  viewers: [],
  messages: [],
  playerState: { playing: false, position: 0, updated_at: 0 },
  syncStatus: 'synced',
  loading: false,

  fetchRooms: async () => {
    set({ loading: true });
    try {
      const rooms = await roomsApi.list();
      set({ rooms, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchRoom: async (id) => {
    set({ loading: true });
    try {
      const room = await roomsApi.get(id);
      const messages = await roomsApi.messages(id);
      set({ currentRoom: room, messages, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  createRoom: async (data) => {
    const room = await roomsApi.create(data as any);
    set((s) => ({ rooms: [room, ...s.rooms] }));
    return room;
  },

  deleteRoom: async (id) => {
    await roomsApi.delete(id);
    set((s) => ({ rooms: s.rooms.filter((r) => r.id !== id) }));
  },

  updateRoomStatus: async (id, status) => {
    const updated = await roomsApi.update(id, { status });
    set((s) => ({
      rooms: s.rooms.map((r) => (r.id === id ? updated : r)),
      currentRoom: s.currentRoom?.id === id ? updated : s.currentRoom,
    }));
  },

  setViewers: (viewers) => set({ viewers }),

  addMessage: (msg) =>
    set((s) => ({ messages: [...s.messages.slice(-199), msg] })),

  setMessages: (messages) => set({ messages }),

  updatePlayer: (state) =>
    set((s) => ({ playerState: { ...s.playerState, ...state } })),

  setSyncStatus: (syncStatus) => set({ syncStatus }),

  clearRoom: () =>
    set({
      currentRoom: null,
      viewers: [],
      messages: [],
      playerState: { playing: false, position: 0, updated_at: 0 },
      syncStatus: 'synced',
    }),
}));
