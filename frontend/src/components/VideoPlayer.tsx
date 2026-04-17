import { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import {
  Play, Pause, Volume2, VolumeX, Maximize2, RefreshCw,
} from 'lucide-react';
import FloatingReactions, { useFloatingReactions } from './FloatingReactions';
import type { ReactionEvent } from '../types';
import styles from './VideoPlayer.module.css';

interface Props {
  url: string;
  playing: boolean;
  syncStatus: 'synced' | 'syncing' | 'desynced';
  onPlay: (pos: number) => void;
  onPause: (pos: number) => void;
  onSeek: (pos: number) => void;
  onSync: () => void;
  playerRef: React.RefObject<any>;
  onReactionFired?: (fn: (e: ReactionEvent) => void) => void;
  isLive?: boolean;
}

export default function VideoPlayer({
  url, playing, syncStatus, onPlay, onPause, onSeek, onSync, playerRef, isLive = false,
}: Props) {
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlTimer = useRef<any>(null);
  const { emojis, fire } = useFloatingReactions();
  const wrapRef = useRef<HTMLDivElement>(null);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    return h > 0
      ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
      : `${m}:${String(sec).padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlTimer.current);
    controlTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  const handleProgress = (state: { playedSeconds: number }) => {
    setProgress(state.playedSeconds);
  };

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLive) return; // Disable seeking for live streams
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const pos = pct * duration;
    playerRef.current?.seekTo(pos, 'seconds');
    onSeek(pos);
  };

  const handleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen();
  };

  const syncColor =
    syncStatus === 'synced' ? 'var(--green)' :
    syncStatus === 'syncing' ? 'var(--amber)' :
    'var(--accent)';

  const syncLabel =
    syncStatus === 'synced' ? 'Synced' :
    syncStatus === 'syncing' ? 'Syncing…' : 'Out of sync';

  const isEmpty = !url;

  return (
    <div
      className={styles.wrap}
      ref={wrapRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {isEmpty ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🎬</div>
          <p>No video URL set for this room</p>
          <span>The host can add one in room settings</span>
        </div>
      ) : (
        <ReactPlayer
          ref={playerRef}
          url={url}
          playing={playing}
          volume={volume}
          muted={muted}
          width="100%"
          height="100%"
          onProgress={handleProgress}
          onDuration={setDuration}
          onPlay={() => onPlay(progress)}
          onPause={() => onPause(progress)}
          style={{ position: 'absolute', top: 0, left: 0 }}
          config={{
            youtube: { playerVars: { disablekb: 1 } },
            file: { attributes: { controlsList: 'nodownload' } },
          }}
        />
      )}

      <FloatingReactions emojis={emojis} />

      {/* Sync badge */}
      <div className={styles.syncBadge} style={{ color: syncColor, borderColor: syncColor }}>
        <span className={styles.syncDot} style={{ background: syncColor }} />
        {syncLabel}
      </div>

      {/* Controls overlay */}
      <div className={`${styles.controls} ${showControls || isEmpty ? styles.visible : ''}`}>
        {/* Progress bar or live indicator */}
        {isLive ? (
          <div className={styles.liveIndicator}>
            <div className={styles.liveDot} />
            <span>LIVE</span>
          </div>
        ) : (
          <div className={styles.progressWrap} onClick={handleSeekClick}>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: duration > 0 ? `${(progress / duration) * 100}%` : '0%' }}
              />
            </div>
          </div>
        )}

        <div className={styles.controlRow}>
          <div className={styles.leftControls}>
            <button
              className={styles.ctrlBtn}
              onClick={() => playing ? onPause(progress) : onPlay(progress)}
              disabled={isEmpty}
            >
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <div className={styles.volumeGroup}>
              <button className={styles.ctrlBtn} onClick={() => setMuted(!muted)}>
                {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                className={styles.volumeSlider}
                min={0} max={1} step={0.05}
                value={muted ? 0 : volume}
                onChange={(e) => { setVolume(+e.target.value); setMuted(false); }}
              />
            </div>

            <span className={styles.timeDisplay}>
              {isLive ? 'LIVE' : `${fmt(progress)} / ${fmt(duration)}`}
            </span>
          </div>

          <div className={styles.rightControls}>
            <button className={styles.ctrlBtn} onClick={onSync} title="Request sync">
              <RefreshCw size={15} />
            </button>
            <button className={styles.ctrlBtn} onClick={handleFullscreen}>
              <Maximize2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
