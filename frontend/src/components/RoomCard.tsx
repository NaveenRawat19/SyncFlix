import { useNavigate } from 'react-router-dom';
import { Users, Play, Lock } from 'lucide-react';
import type { Room } from '../types';
import styles from './RoomCard.module.css';

const CATEGORY_EMOJI: Record<string, string> = {
  Movies: '🎬', 'TV Shows': '📺', Gaming: '🎮',
  Educational: '📚', Music: '🎵', Other: '🌐',
};

interface Props { room: Room; onDelete?: (id: string) => void; isOwner?: boolean; }

export default function RoomCard({ room, onDelete, isOwner }: Props) {
  const navigate = useNavigate();

  return (
    <div className={`${styles.card} ${room.status === 'live' ? styles.live : ''}`}>
      {room.status === 'live' && (
        <div className={styles.liveStripe} />
      )}

      <div className={styles.thumb}>
        <span className={styles.emoji}>{CATEGORY_EMOJI[room.category] ?? '🎬'}</span>
        {room.status === 'live' && (
          <span className={styles.liveBadge}>
            <span className={styles.liveDot} />LIVE
          </span>
        )}
        {room.access === 'private' && (
          <span className={styles.lockBadge}><Lock size={10} /></span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.title}>{room.title}</div>
        <div className={styles.host}>by {room.host?.username ?? 'Unknown'}</div>
        {room.description && (
          <div className={styles.desc}>{room.description}</div>
        )}

        <div className={styles.meta}>
          <span className={styles.viewers}>
            <Users size={12} /> {room.viewer_count} watching
          </span>
          <span className={`${styles.statusPill} ${styles[room.status]}`}>
            {room.status}
          </span>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.btnJoin}
            onClick={() => navigate(`/rooms/${room.id}`)}
          >
            <Play size={13} /> Join Room
          </button>
          {isOwner && onDelete && (
            <button
              className={styles.btnDelete}
              onClick={(e) => { e.stopPropagation(); onDelete(room.id); }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
