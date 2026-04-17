import { useEffect, useRef } from 'react';
import { socketService } from '../services/socket';
import { useAuthStore } from '../store/authStore';
import { useRoomStore } from '../store/roomStore';
import type { ReactionEvent } from '../types';

interface UseSocketOptions {
  roomId: string;
  onReaction?: (event: ReactionEvent) => void;
  playerRef?: React.RefObject<any>;
  isLive?: boolean;
}

export function useSocket({ roomId, onReaction, playerRef, isLive = false }: UseSocketOptions) {
  const { user } = useAuthStore();
  const { setViewers, addMessage, updatePlayer, setSyncStatus } = useRoomStore();
  const cleanupFns = useRef<Array<() => void>>([]);

  useEffect(() => {
    if (!roomId) return;

    const socket = socketService.connect();

    // Join the room
    socketService.joinRoom({
      room_id: roomId,
      user_id: user?.id ?? 'guest',
      username: user?.username ?? 'Guest',
      avatar_color: user?.avatar_color ?? '#e63c6e',
    });

    // Sync state on join
    const offSync = socketService.onSyncState((data) => {
      setViewers(data.viewers);
      updatePlayer({ playing: data.playing, position: data.position });
      if (playerRef?.current) {
        playerRef.current.seekTo(data.position, 'seconds');
      }
      setSyncStatus('synced');
    });

    // Play event from another viewer
    const offPlay = socketService.onPlay((data) => {
      updatePlayer({ playing: true, position: data.position });
      if (playerRef?.current) playerRef.current.seekTo(data.position, 'seconds');
    });

    // Pause event
    const offPause = socketService.onPause((data) => {
      updatePlayer({ playing: false, position: data.position });
      if (playerRef?.current) playerRef.current.seekTo(data.position, 'seconds');
    });

    // Seek event
    const offSeek = socketService.onSeek((data) => {
      if (playerRef?.current) playerRef.current.seekTo(data.position, 'seconds');
      updatePlayer({ position: data.position });
    });

    // Viewer joined / left
    const offJoined = socketService.onViewerJoined((data) => {
      setViewers(data.viewers);
      addMessage({
        id: Date.now().toString(),
        room_id: roomId,
        user_id: data.user.user_id,
        username: data.user.username,
        avatar_color: data.user.avatar_color,
        text: `${data.user.username} joined the room`,
        msg_type: 'system',
        created_at: new Date().toISOString(),
      });
    });

    const offLeft = socketService.onViewerLeft((data) => {
      setViewers(data.viewers);
    });

    // Chat messages
    const offChat = socketService.onChatBroadcast((msg) => {
      addMessage(msg);
    });

    // Reactions
    const offReaction = socketService.onReactionBroadcast((data) => {
      onReaction?.(data);
    });

    cleanupFns.current = [offSync, offPlay, offPause, offSeek, offJoined, offLeft, offChat, offReaction];

    return () => {
      cleanupFns.current.forEach((fn) => fn());
      socketService.leaveRoom(roomId);
    };
  }, [roomId, user]);

  const emitPlay = (position: number) => {
    setSyncStatus('syncing');
    socketService.play(roomId, position);
    setTimeout(() => setSyncStatus('synced'), 600);
  };

  const emitPause = (position: number) => {
    setSyncStatus('syncing');
    socketService.pause(roomId, position);
    setTimeout(() => setSyncStatus('synced'), 600);
  };

  const emitSeek = (position: number) => {
    if (isLive) return; // No seeking for live streams
    socketService.seek(roomId, position);
  };

  const emitChat = (text: string) => {
    if (!text.trim() || !user) return;
    socketService.sendChat({
      room_id: roomId,
      user_id: user.id,
      username: user.username,
      avatar_color: user.avatar_color,
      text,
    });
  };

  const emitReaction = (emoji: string) => {
    socketService.sendReaction({
      room_id: roomId,
      emoji,
      username: user?.username ?? 'Guest',
    });
  };

  const requestSync = () => socketService.requestSync(roomId);

  return { emitPlay, emitPause, emitSeek, emitChat, emitReaction, requestSync };
}
