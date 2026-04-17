import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Tv2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const { login, register } = useAuthStore();
  const navigate = useNavigate();

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      } else {
        await register(form.username, form.email, form.password);
        toast.success('Account created!');
      }
      navigate('/rooms');
    } catch (err: any) {
      const msg = err?.response?.data?.detail ?? 'Something went wrong';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Brand */}
        <Link to="/" className={styles.brand}>
          <Tv2 size={22} color="var(--accent)" />
          <span>Sync<b>Flix</b></span>
        </Link>

        <h2 className={styles.title}>
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className={styles.sub}>
          {mode === 'login'
            ? "Sign in to join rooms and watch together"
            : "Join SyncFlix and start watching with friends"}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className={styles.field}>
              <label className={styles.label}>Username</label>
              <input
                className={styles.input}
                type="text"
                placeholder="coolviewer42"
                value={form.username}
                onChange={(e) => set('username', e.target.value)}
                required
                minLength={3}
                maxLength={50}
                autoComplete="username"
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.pwdWrap}>
              <input
                className={styles.input}
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className={styles.pwdToggle}
                onClick={() => setShowPwd(!showPwd)}
                tabIndex={-1}
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.btnSubmit}
            disabled={loading}
          >
            {loading
              ? 'Please wait…'
              : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className={styles.toggle}>
          {mode === 'login' ? (
            <>Don't have an account?{' '}
              <button onClick={() => setMode('register')}>Sign up</button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={() => setMode('login')}>Sign in</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
