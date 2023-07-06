import FooterText from '../../assets/icons/FooterConstellation.svg';
import styles from './Footer.module.scss';

export const Footer = () => {
  const handleOpenForm = () => {
    window.open('https://www.google.com', '_blank');
  }
  return (
    <>
      <footer className={`${styles.fullWidth2} background`}>
        <div className={`${styles.footer}`}>
          <div className={styles.footerText}>© 2022 CONSTELLATION NETWORK</div>
          <img className={styles.poweredBy} src={FooterText} />
          <button onClick={handleOpenForm}>Submit a Metagraph</button>
        </div>
      </footer>
      <div></div>
    </>
  );
};
