import dayjs from 'dayjs';
import FooterText from '../../assets/icons/FooterConstellation.svg';
import { URL_SUBMIT_METAGRAPH_FORM } from '../../utils/consts';

import styles from './Footer.module.scss';

export const Footer = () => {
  const handleOpenForm = () => {
    window.open(URL_SUBMIT_METAGRAPH_FORM, '_blank');
  };

  return (
    <>
      <footer className={`${styles.fullWidth2} background`}>
        <div className={`${styles.footer}`}>
          <div className={styles.footerText}>© {dayjs().year()} CONSTELLATION NETWORK</div>
          <img className={styles.poweredBy} src={FooterText} />
          <button onClick={handleOpenForm}>Submit a Metagraph</button>
        </div>
      </footer>
      <div></div>
    </>
  );
};
