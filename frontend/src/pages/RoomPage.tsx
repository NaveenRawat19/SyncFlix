import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRoomStore } from '../store/roomStore';
import { useAuthStore } from '../store/authStore';
import { useSocket } from '../hooks/useSocket';
import VideoPlayer from '../components/VideoPlayer';
import ChatPanel from '../components/ChatPanel';
import ViewersList from '../components/ViewersList';
import { ArrowLeft, Settings, Users, MessageSquare, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './RoomPage.module.css';

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentRoom, viewers, messages, playerState, syncStatus, fetchRoom, updateRoomStatus, clearRoom } = useRoomStore();
  const { user, isAuthenticated } = useAuthStore();
  const playerRef = useRef<any>(null);
  const [sidebar, setSidebar] = useState<'chat' | 'viewers'>('chat');
  const [showSettings, setShowSettings] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const isHost = currentRoom?.host_id === user?.id;

  // Load room
  useEffect(() => {
    if (!id) return;
    fetchRoom(id);
    return () => clearRoom();
  }, [id]);

  useEffect(() => {
    if (currentRoom?.video_url) setVideoUrl(currentRoom.video_url);
  }, [currentRoom?.video_url]);

  // Socket
  const { emitPlay, emitPause, emitSeek, emitChat, emitReaction, requestSync } = useSocket({
    roomId: id ?? '',
    playerRef,
    isLive: currentRoom?.status === 'live',
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleGoLive = async () => {
    if (!id) return;
    await updateRoomStatus(id, currentRoom?.status === 'live' ? 'waiting' : 'live');
    toast.success(currentRoom?.status === 'live' ? 'Room set to waiting' : '🔴 Room is now live!');
  };

  const handleUpdateUrl = async () => {
    if (!id || !videoUrl.trim()) return;
    try {
      const { roomsApi } = await import('../services/api');
      await roomsApi.update(id, { video_url: videoUrl });
      toast.success('Video URL updated');
      setShowSettings(false);
    } catch {
      toast.error('Failed to update video URL');
    }
  };

  if (!currentRoom) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>Loading room…</span>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Room header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => navigate('/rooms')}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className={styles.roomTitle}>{currentRoom.title}</h1>
            <div className={styles.roomMeta}>
              <span>Hosted by <b>{currentRoom.host?.username}</b></span>
              <span className={styles.dot}>·</span>
              <span className={`${styles.statusPill} ${styles[currentRoom.status]}`}>
                {currentRoom.status}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.headerRight}>
          <button
            className={`${styles.sidebarToggle} ${sidebar === 'viewers' ? styles.sidebarActive : ''}`}
            onClick={() => setSidebar(sidebar === 'viewers' ? 'chat' : 'viewers')}
            title="Toggle viewers list"
          >
            <Users size={15} />
            <span>{viewers.length}</span>
          </button>
          <button
            className={`${styles.sidebarToggle} ${sidebar === 'chat' ? styles.sidebarActive : ''}`}
            onClick={() => setSidebar('chat')}
            title="Chat"
          >
            <MessageSquare size={15} />
          </button>
          <button className={styles.iconBtn} onClick={handleShare} title="Copy link">
            <Share2 size={15} />
          </button>
          {isHost && (
            <>
              <button className={styles.iconBtn} onClick={() => setShowSettings(!showSettings)} title="Settings">
                <Settings size={15} />
              </button>
              <button
                className={`${styles.liveBtn} ${currentRoom.status === 'live' ? styles.liveBtnActive : ''}`}
                onClick={handleGoLive}
              >
                {currentRoom.status === 'live' ? '⬛ End Stream' : '🔴 Go Live'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Host settings panel */}
      {showSettings && isHost && (
        <div className={styles.settingsBar}>
          <label className={styles.settingsLabel}>Video URL</label>
          <input
            className={styles.settingsInput}
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Paste YouTube, Vimeo, or direct video URL…"
          />
          <button className={styles.settingsBtn} onClick={handleUpdateUrl}>Update</button>
          <button className={styles.settingsBtnGhost} onClick={() => setShowSettings(false)}>Cancel</button>
        </div>
      )}

      {/* Main layout: player + sidebar */}
      <div className={styles.layout}>
        {/* Player */}
        <div className={styles.playerWrap}>
          <VideoPlayer
            url={currentRoom?.video_url || ''}
            playing={playerState.playing}
            syncStatus={syncStatus}
            onPlay={emitPlay}
            onPause={emitPause}
            onSeek={emitSeek}
            onSync={requestSync}
            playerRef={playerRef}
            isLive={currentRoom?.status === 'live'}
          />

          {/* Room info below player */}
          <div className={styles.playerMeta}>
            <div>
              <div className={styles.playerTitle}>{currentRoom.title}</div>
              {currentRoom.description && (
                <div className={styles.playerDesc}>{currentRoom.description}</div>
              )}
            </div>
            {!isAuthenticated && (
              <Link to="/auth" className={styles.signInHint}>
                Sign in to chat →
              </Link>
            )}
          </div>

          {/* Viewers below on smaller screens */}
          <div className={styles.viewersMobile}>
            <ViewersList viewers={viewers} hostId={currentRoom.host_id} />
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {sidebar === 'chat' ? (
            <>
              <div className={styles.viewersDesktop}>
                <ViewersList viewers={viewers} hostId={currentRoom.host_id} />
              </div>
              <div className={styles.chatWrap}>
                <ChatPanel
                  messages={messages}
                  onSendMessage={isAuthenticated ? emitChat : () => toast('Sign in to chat', { icon: '🔒' })}
                  onSendReaction={emitReaction}
                />
              </div>
            </>
          ) : (
            <div className={styles.viewersDesktop} style={{ flex: 1 }}>
              <ViewersList viewers={viewers} hostId={currentRoom.host_id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
