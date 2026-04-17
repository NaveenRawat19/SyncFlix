import { useState, useCallback } from 'react';
import styles from './FloatingReactions.module.css';

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
}

export function useFloatingReactions() {
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);
  let counter = 0;

  const fire = useCallback((emoji: string) => {
    const id = ++counter;
    const x = 10 + Math.random() * 80;
    setEmojis((prev) => [...prev, { id, emoji, x }]);
    setTimeout(() => {
      setEmojis((prev) => prev.filter((e) => e.id !== id));
    }, 1800);
  }, []);

  return { emojis, fire };
}

interface Props {
  emojis: FloatingEmoji[];
}

export default function FloatingReactions({ emojis }: Props) {
  return (
    <div className={styles.container} aria-hidden>
      {emojis.map((e) => (
        <span
          key={e.id}
          className={styles.emoji}
          style={{ left: `${e.x}%` }}
        >
          {e.emoji}
        </span>
      ))}
    </div>
  );
}
