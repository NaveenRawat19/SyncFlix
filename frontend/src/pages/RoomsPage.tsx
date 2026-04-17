import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRoomStore } from '../store/roomStore';
import { useAuthStore } from '../store/authStore';
import RoomCard from '../components/RoomCard';
import { Search, Plus, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './RoomsPage.module.css';

const CATEGORIES = ['All', 'Movies', 'TV Shows', 'Gaming', 'Educational', 'Music', 'Other'];
const STATUSES   = ['All', 'live', 'waiting', 'ended'];

export default function RoomsPage() {
  const { rooms, fetchRooms, deleteRoom, loading } = useRoomStore();
  const { user, isAuthenticated } = useAuthStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  useEffect(() => { fetchRooms(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this room?')) return;
    await deleteRoom(id);
    toast.success('Room deleted');
  };

  const filtered = rooms.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
                        r.host?.username?.toLowerCase().includes(search.toLowerCase());
    const matchCat   = category === 'All' || r.category === category;
    const matchStat  = status === 'All' || r.status === status;
    return matchSearch && matchCat && matchStat;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Browse Rooms</h1>
          <p className={styles.sub}>{rooms.length} active rooms</p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.refreshBtn} onClick={fetchRooms} disabled={loading}>
            <RefreshCw size={15} className={loading ? styles.spinning : ''} />
          </button>
          {isAuthenticated && (
            <Link to="/rooms/new" className={styles.btnCreate}>
              <Plus size={15} /> New Room
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search rooms or hosts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.pills}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`${styles.pill} ${category === c ? styles.pillActive : ''}`}
              onClick={() => setCategory(c)}
            >{c}</button>
          ))}
        </div>
        <div className={styles.pills}>
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`${styles.pill} ${status === s ? styles.pillActive : ''}`}
              onClick={() => setStatus(s)}
            >{s === 'All' ? 'All Status' : s}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading && rooms.length === 0 ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          Loading rooms…
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyEmoji}>🎬</span>
          <p>No rooms found</p>
          <span>Try a different search or create your own!</span>
          {isAuthenticated && (
            <Link to="/rooms/new" className={styles.btnCreate} style={{ marginTop: 12 }}>
              <Plus size={14} /> Create Room
            </Link>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              isOwner={room.host_id === user?.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
