import styles from './NotFound.module.scss';
import { useNavigate } from 'react-router-dom';
import ArrowBack from '../../assets/icons/ArrowBack.svg';
import { SearchBar } from '../../components/SearchBar/SearchBar';
export const NotFound = ({ entire }: { entire: boolean }) => {
  const navigate = useNavigate();
  return (
    <>
      {entire && (
        <section className={`${styles.searchMobile}`}>
          <div className={`${styles.row} ${styles.subheader}`}>
            <SearchBar />
          </div>
        </section>
      )}
      <div className={entire ? styles.content : styles.subContent}>
        <div className={styles.notFound}>404</div>
        <div className={styles.sorry}>
          Sorry, the page you are looking for doesn&apos;t exist. Please check back soon.
        </div>
        <div className={styles.homeButton} onClick={() => navigate('/')}>
          <img src={ArrowBack} />
          <p className={`${styles.homeText}`}>Back to Homepage</p>
        </div>
      </div>
    </>
  );
};
