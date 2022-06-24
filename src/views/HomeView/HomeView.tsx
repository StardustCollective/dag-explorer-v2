import { SearchBar } from '../../components/SearchBar/SearchBar';
import styles from './HomeView.module.scss';
import StatsSection from './StatsSection/StatsSection';

export const HomeView = () => {
  return (
    <>
      <section className={`${styles.fullWidth} ${styles.section}`}>
        <div className={`${styles.row} ${styles.subheader}`}>
          <SearchBar />
        </div>
      </section>
      <main className={`${styles.fullWidth2} background`}>
        <div className={`${styles.row} ${styles.fila1}`}>
          <StatsSection />
        </div>
        <div className={`${styles.row} ${styles.fila2}`}>tableSection</div>
      </main>
    </>
  );
};
