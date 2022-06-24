import { Dropdown } from './Dropdown';
import styles from './Nav.module.scss';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/icons/HeaderLogo.svg';

export const Nav = () => {
  const navigate = useNavigate();
  return (
    <>
      <nav className={styles.fullWidth}>
        <div className={styles.maxWidth}>
          <div className={styles.leftSide} onClick={() => navigate('/')}>
            <img className={styles.navSeparator} src={Logo} />
            <p className={styles.title}>DAG Explorer</p>
          </div>
          <div className={styles.rightSide}>
            <Dropdown />
            <p>USD</p>
          </div>
        </div>
      </nav>
    </>
  );
};
