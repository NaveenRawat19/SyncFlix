import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Tv2, Users, Plus, Home } from 'lucide-react';
import styles from './Layout.module.css';

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.shell}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.brand}>
          <Tv2 size={20} color="var(--accent)" strokeWidth={2.5} />
          <span>Sync<b>Flix</b></span>
        </Link>

        <div className={styles.navLinks}>
          <Link to="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}>
            <Home size={15} /> Home
          </Link>
          <Link to="/rooms" className={`${styles.navLink} ${pathname === '/rooms' ? styles.active : ''}`}>
            <Users size={15} /> Rooms
          </Link>
        </div>

        <div className={styles.navRight}>
          {isAuthenticated ? (
            <>
              <Link to="/rooms/new" className={styles.btnCreate}>
                <Plus size={15} /> New Room
              </Link>
              <div className={styles.userChip}>
                <div
                  className={styles.avatar}
                  style={{ background: user?.avatar_color }}
                >
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <span>{user?.username}</span>
              </div>
              <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <Link to="/auth" className={styles.btnLogin}>Sign In</Link>
          )}
        </div>
      </nav>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
