import { NavDropdown } from './NavDropdown';
import { Link } from 'react-router-dom';
import Logo from '../../assets/icons/HeaderLogo.svg';
import styles from './Nav.module.scss';

export const Nav = () => {
  return (
    <>
      <nav className={styles.fullWidth}>
        <div className={styles.maxWidth}>
          <Link to={'/'} className={styles.leftSide}>
            <img className={styles.navSeparator} src={Logo} />
            <p className={styles.title}>DAG Explorer</p>
          </Link>
          <div className={styles.rightSide}>
            <NavDropdown />
            <p>USD</p>
          </div>
        </div>
      </nav>
    </>
  );
};
