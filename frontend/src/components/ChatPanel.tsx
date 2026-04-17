import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import type { ChatMessage } from '../types';
import styles from './ChatPanel.module.css';

const REACTIONS = ['😂', '🔥', '❤️', '👏', '😭', '😍', '🤯', '💯'];

interface Props {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onSendReaction: (emoji: string) => void;
}

export default function ChatPanel({ messages, onSendMessage, onSendReaction }: Props) {
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setText('');
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span>Live Chat</span>
        <span className={styles.count}>{messages.length}</span>
      </div>

      <div className={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.msg} ${msg.msg_type === 'system' ? styles.system : ''}`}
          >
            {msg.msg_type !== 'system' ? (
              <>
                <div
                  className={styles.avatar}
                  style={{ background: msg.avatar_color }}
                >
                  {msg.username[0]?.toUpperCase()}
                </div>
                <div className={styles.msgBody}>
                  <span className={styles.username} style={{ color: msg.avatar_color }}>
                    {msg.username}
                  </span>
                  <span className={styles.text}>{msg.text}</span>
                </div>
              </>
            ) : (
              <span className={styles.systemText}>{msg.text}</span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className={styles.reactions}>
        {REACTIONS.map((emoji) => (
          <button
            key={emoji}
            className={styles.reactionBtn}
            onClick={() => onSendReaction(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          value={text}
          placeholder="Send a message…"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          maxLength={300}
        />
        <button className={styles.sendBtn} onClick={handleSend} disabled={!text.trim()}>
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
