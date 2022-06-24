import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchableItem } from '../../constants';
import { getSearchInputType } from '../../utils/search';
import styles from './SearchBar.module.scss';

export const SearchBar = () => {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState<string>('');

  const handleKey = (e) => {
    if (e.code === 'Enter' && searchText !== '') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    const inputType = getSearchInputType(searchText);
    switch (inputType) {
      case SearchableItem.Address: {
        navigate('/address/' + searchText);
        break;
      }
      case SearchableItem.Snapshot: {
        navigate('/snapshots/' + searchText);
        break;
      }
      case SearchableItem.Transaction: {
        navigate('/transactions/' + searchText);
        break;
      }
      default: {
        navigate('/404');
        break;
      }
    }
  };

  return (
    <div className={styles.searchBar} onKeyDown={(e) => handleKey(e)}>
      <div className={styles.searchLeft}>
        <div className={styles.searchIcon} />
        <input
          onChange={(e) => setSearchText(e.target.value)}
          className={styles.searchInput}
          placeholder="Search by address, snapshot height, or transaction..."
        ></input>
      </div>
      <div
        className={styles.searchButton}
        onClick={() => {
          handleSearch();
        }}
      >
        <p> Search </p>
      </div>
    </div>
  );
};
