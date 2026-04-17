import { Link } from 'react-router-dom';
import { Tv2, Users, Zap, Lock, MessageSquare, RefreshCw } from 'lucide-react';
import styles from './HomePage.module.css';

const FEATURES = [
  { icon: <RefreshCw size={22} />, title: 'Perfect Sync', desc: 'Millisecond-accurate playback sync across all viewers in real time.' },
  { icon: <MessageSquare size={22} />, title: 'Live Chat', desc: 'React with emoji and chat with your group as you watch together.' },
  { icon: <Users size={22} />, title: 'Group Rooms', desc: 'Create public or private rooms and invite anyone via link.' },
  { icon: <Zap size={22} />, title: 'Any Video', desc: 'YouTube, Vimeo, Twitch, direct MP4 — paste any URL and watch.' },
  { icon: <Lock size={22} />, title: 'Private Sessions', desc: 'Lock your room so only invited guests can join.' },
  { icon: <Tv2 size={22} />, title: 'Host Controls', desc: 'Hosts control playback for everyone — play, pause, seek together.' },
];

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroDot} />
            Real-time Group Streaming Platform
          </div>
          <h1 className={styles.heroTitle}>
            Watch Together,<br />
            <span className={styles.heroAccent}>Anywhere.</span>
          </h1>
          <p className={styles.heroSub}>
            Create a room, paste a video URL, and invite your friends.<br />
            SyncFlix keeps everyone perfectly in sync — play, pause, seek together.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/rooms/new" className={styles.btnPrimary}>
              Create a Room
            </Link>
            <Link to="/rooms" className={styles.btnGhost}>
              Browse Rooms →
            </Link>
          </div>
        </div>

        {/* Decorative preview card */}
        <div className={styles.heroCard}>
          <div className={styles.cardBar}>
            <span className={styles.livePill}><span className={styles.liveDot}/>LIVE</span>
            <span className={styles.cardTitle}>Movie Night 🎬</span>
            <span className={styles.viewerCount}>👁 12</span>
          </div>
          <div className={styles.cardScreen}>
            <div className={styles.screenGlow} />
            <span className={styles.screenEmoji}>🎬</span>
            <div className={styles.screenSync}>
              <span className={styles.syncDot} />
              All synced
            </div>
          </div>
          <div className={styles.cardChat}>
            {[
              { c: '#e63c6e', u: 'naveen_r', m: 'this scene is crazy 🔥' },
              { c: '#7c3aed', u: 'priya_s', m: 'omg yes!! 😭' },
              { c: '#3b82f6', u: 'aisha_k', m: '👏👏👏' },
            ].map((msg) => (
              <div key={msg.u} className={styles.chatRow}>
                <div className={styles.chatAvatar} style={{ background: msg.c }}>
                  {msg.u[0].toUpperCase()}
                </div>
                <span className={styles.chatUser} style={{ color: msg.c }}>{msg.u}</span>
                <span className={styles.chatMsg}>{msg.m}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Everything you need to watch together</h2>
        <div className={styles.featureGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <div className={styles.featureTitle}>{f.title}</div>
              <div className={styles.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to watch together?</h2>
        <p className={styles.ctaSub}>No downloads. No installs. Just paste a link and go.</p>
        <Link to="/rooms/new" className={styles.btnPrimary}>
          Start Watching →
        </Link>
      </section>
    </div>
  );
}
