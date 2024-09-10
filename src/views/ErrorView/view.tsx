import clsx from 'clsx';

import styles from './view.module.scss';

import ArrowBack from '../../assets/icons/ArrowBack.svg';
import { SearchBar } from '../../components/SearchBar/SearchBar';

export const ErrorView = ({ error }: { error: unknown }) => {
  console.error(error);

  return (
    <>
      <section className={`${styles.searchMobile}`}>
        <div className={`${styles.row} ${styles.subheader}`}>
          <SearchBar />
        </div>
      </section>
      <div className={clsx(styles.content)}>
        <div className={styles.sorry}>
          Sorry, there was an internal error while loading the app, please reload the page. If the problem persists
          please contact our customer support channels.
        </div>
        <a className={styles.homeButton} href="/">
          <img src={ArrowBack} />
          <p className={styles.homeText}>Back to Homepage</p>
        </a>
      </div>
    </>
  );
};
