import { NavDropdown } from './NavDropdown';
import styles from './Nav.module.scss';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/icons/HeaderLogo.svg';

export const Nav = () => {
  const navigate = useNavigate();
  return (
    <>
      <nav className={styles.fullWidth}>
        <div className={styles.maxWidth}>
          <div
            className={styles.leftSide}
            onClick={() => (location.pathname === '/' ? window.location.reload() : navigate('/'))}
          >
            <img className={styles.navSeparator} src={Logo} />
            <p className={styles.title}>DAG Explorer</p>
          </div>
          <div className={styles.rightSide}>
            <NavDropdown />
            <p>USD</p>
          </div>
        </div>
      </nav>
    </>
  );
};
