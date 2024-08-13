import { NavDropdown } from './NavDropdown';
import { Link } from 'react-router-dom';
import Logo from '../../assets/icons/HeaderLogo.svg';
import styles from './Nav.module.scss';
import { useContext } from 'react';
import { NetworkContext } from '../../context/NetworkContext';

export const Nav = () => {
  const { network } = useContext(NetworkContext);

  return (
    <>
      <nav className={styles.fullWidth}>
        <div className={styles.maxWidth}>
          <Link to={'/'} className={styles.leftSide}>
            <img className={styles.navSeparator} src={Logo} />
            <p className={styles.title}>DAG Explorer</p>
          </Link>
          <div className={styles.rightSide}>
            {network !== 'mainnet1' && (
              <Link className={styles.metagraphsLink} to="/metagraphs">
                Metagraphs
              </Link>
            )}
            <Link className={styles.metagraphsLink} to="/node-explorer">
              Node Explorer
            </Link>
            <NavDropdown />
          </div>
        </div>
      </nav>
    </>
  );
};
