import { useState } from 'react';
import clsx from 'clsx';

import { useLocation, useNavigate } from 'react-router-dom';
import { SearchableItem } from '../../constants';
import { getSearchInputType } from '../../utils/search';

import styles from './SearchTokenBar.module.scss';

export const handleSearch = (searchText: string, performAction: (url: string) => void) => {
  const inputType = getSearchInputType(searchText);
  switch (inputType) {
    case SearchableItem.Address: {
      const url = '/address/' + searchText;
      performAction(url);
      break;
    }
    case SearchableItem.Snapshot: {
      const url = '/snapshots/' + searchText;
      performAction(url);
      break;
    }
    case SearchableItem.Transaction: {
      const url = '/transactions/' + searchText;
      performAction(url);
      break;
    }
    default: {
      const url = '/404';
      performAction(url);
      break;
    }
  }
};

export const SearchTokenBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchText, setSearchText] = useState<string>('');

  const isSameLocation = (url: string) => url === location.pathname;

  const performAction = (url: string) => {
    isSameLocation(url) ? window.location.reload() : navigate(url);
  };

  const handleKey = (e) => {
    if (e.code === 'Enter' && searchText !== '') {
      handleSearch(searchText, performAction);
    }
  };

  return (
    <>
      <div className={styles.searchBar} onKeyDown={(e) => handleKey(e)}>
        <input
          onChange={(e) => setSearchText(e.target.value)}
          className={styles.searchInput}
          placeholder="Search for tokens"
        />
        <div className={styles.searchBlock}>
          <div className={styles.searchLeft}>
            <div
              onClick={() => {
                handleSearch(searchText, performAction);
              }}
              className={styles.searchIcon}
            />
          </div>
        </div>
      </div>
      <div
        className={clsx(styles.searchButton, styles.oldIos)}
        onClick={() => {
          handleSearch(searchText, performAction);
        }}
      >
        <p> Search </p>
      </div>
    </>
  );
};
