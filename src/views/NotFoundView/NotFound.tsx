import styles from './NotFound.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBack from '../../assets/icons/ArrowBack.svg';
import { SearchBar } from '../../components/SearchBar/SearchBar';
export const NotFound = ({ entire, errorCode, notRow }: { entire: boolean; errorCode: string; notRow?: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {entire && (
        <section className={`${styles.searchMobile}`}>
          <div className={`${styles.row} ${styles.subheader}`}>
            <SearchBar />
          </div>
        </section>
      )}
      <div className={`${entire ? styles.content : styles.subContent} ${notRow && styles.notRow}`}>
        <div className={styles.notFound}>{errorCode}</div>
        <div className={styles.sorry}>
          {errorCode === '500'
            ? 'Sorry, there was a problem in the server and we were not able to process your request'
            : 'Sorry, the page you are looking for doesn&apos;t exist. Please check back soon.'}
        </div>
        <div
          className={styles.homeButton}
          onClick={() => (location.pathname === '/' ? window.location.reload() : navigate('/'))}
        >
          <img src={ArrowBack} />
          <p className={`${styles.homeText}`}>Back to Homepage</p>
        </div>
      </div>
    </>
  );
};
