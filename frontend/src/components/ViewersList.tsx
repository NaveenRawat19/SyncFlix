import type { ViewerInfo } from '../types';
import { Crown } from 'lucide-react';
import styles from './ViewersList.module.css';

interface Props {
  viewers: ViewerInfo[];
  hostId: string;
}

export default function ViewersList({ viewers, hostId }: Props) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span>Viewers</span>
        <span className={styles.badge}>{viewers.length} online</span>
      </div>
      <div className={styles.list}>
        {viewers.length === 0 && (
          <div className={styles.empty}>No viewers yet</div>
        )}
        {viewers.map((v) => (
          <div key={v.sid} className={styles.row}>
            <div className={styles.avatar} style={{ background: v.avatar_color }}>
              {v.username[0]?.toUpperCase()}
            </div>
            <span className={styles.name}>{v.username}</span>
            {v.user_id === hostId && (
              <span className={styles.hostTag}>
                <Crown size={10} /> HOST
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
