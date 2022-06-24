import { useGetLatestSnapshots, useGetLatestTransactions } from '../../api/mainnet_1/block-explorer';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import styles from './HomeView.module.scss';
import StatsSection from './StatsSection/StatsSection';

export const HomeView = () => {
  const startAt = '0';
  const endAt = '9';
  const query = `?startAt="${startAt}"&endAt="${endAt}"&orderBy="$key"`;

  const asd = useGetLatestSnapshots(query);
  const asd2 = useGetLatestTransactions(query);

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
