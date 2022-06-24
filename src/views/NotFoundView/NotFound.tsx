import styles from './NotFound.module.scss';
import { useNavigate } from 'react-router-dom';
export const NotFound = ({ entire }: { entire: boolean }) => {
  const navigate = useNavigate();
  return (
    <div className={entire ? styles.content : styles.subContent}>
      <div className={styles.notFound}>404</div>
      <div className={styles.homeButton} onClick={() => navigate('/')}>
        <p className={styles.homeText}>Homepage</p>
      </div>
    </div>
  );
};
