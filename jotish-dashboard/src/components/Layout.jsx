import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/layout.module.css';

export default function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.appContainer}>
      <nav className={styles.navbar}>
        <div className={styles.brand}>Insights Dashboard</div>
        <div className={styles.navLinks}>
          <Link to="/list" className={styles.link}>Directory</Link>
          <Link to="/analytics" className={styles.link}>Analytics</Link>
        </div>
        <div className={styles.userSection}>
          <span className={styles.userBadge}>{user}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
        </div>
      </nav>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
