import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoomStore } from '../store/roomStore';
import toast from 'react-hot-toast';
import styles from './CreateRoomPage.module.css';

const CATEGORIES = ['Movies', 'TV Shows', 'Gaming', 'Educational', 'Music', 'Other'];

export default function CreateRoomPage() {
  const { createRoom } = useRoomStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    video_url: '',
    category: 'Movies',
    access: 'public' as 'public' | 'private',
    max_viewers: 50,
  });

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Room title is required');
    setLoading(true);
    try {
      const room = await createRoom(form);
      toast.success('Room created!');
      navigate(`/rooms/${room.id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create a Room</h1>
        <p className={styles.sub}>Set up your watch party — invite friends after you create it.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Room Title *</label>
            <input
              className={styles.input}
              placeholder="e.g. Movie Night 🎬"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required maxLength={100}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="What are you watching?"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Video URL</label>
            <input
              className={styles.input}
              placeholder="YouTube, Vimeo, direct MP4 URL…"
              value={form.video_url}
              onChange={(e) => set('video_url', e.target.value)}
              type="url"
            />
            <span className={styles.hint}>Supports YouTube, Vimeo, Twitch, SoundCloud, and direct file URLs.</span>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Category</label>
              <select
                className={styles.select}
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Max Viewers</label>
              <input
                className={styles.input}
                type="number"
                min={2} max={500}
                value={form.max_viewers}
                onChange={(e) => set('max_viewers', +e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Access</label>
            <div className={styles.accessGrid}>
              {(['public', 'private'] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  className={`${styles.accessOption} ${form.access === a ? styles.accessActive : ''}`}
                  onClick={() => set('access', a)}
                >
                  <span className={styles.accessIcon}>{a === 'public' ? '🌐' : '🔒'}</span>
                  <div>
                    <div className={styles.accessTitle}>{a === 'public' ? 'Public' : 'Private'}</div>
                    <div className={styles.accessDesc}>
                      {a === 'public' ? 'Anyone can join' : 'Invite link only'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={() => navigate(-1)}
            >Cancel</button>
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={loading}
            >
              {loading ? 'Creating…' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
