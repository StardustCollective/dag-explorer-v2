import styles from './Footer.module.scss';
import FooterText from '../../assets/icons/FooterConstellation.svg';

export const Footer = () => {
  return (
    <footer className={`${styles.fullWidth2} background`}>
      <div className={`${styles.footer}`}>
        <div className={`${styles.footerLeft} text`}>
          <div>© 2021 Constellation Network</div>
          <div>DAG Explorer v2.0</div>
        </div>
        <img className={styles.poweredBy} src={FooterText} />
      </div>
    </footer>
  );
};
