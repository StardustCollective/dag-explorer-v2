import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Network, SearchableItem } from '../../constants';
import { checkIfBEUrlExists, getSearchInputType } from '../../utils/search';

import styles from './SearchBar.module.scss';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';


export const handleSearch = async (searchText: string, performAction: (url: string) => void, network: Network) => {
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
    case SearchableItem.Hash: {
      const snapshotUrl = `/global-snapshots/${searchText}`
      const snapshotExists = await checkIfBEUrlExists(snapshotUrl, network)
      if(snapshotExists){
        const url = '/snapshots/' + searchText;
        performAction(url);
        break;
      }

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

export const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { network } = useContext(NetworkContext) as NetworkContextType;

  const [searchText, setSearchText] = useState<string>('');

  const isSameLocation = (url: string) => url === location.pathname;

  const performAction = (url: string) => {
    isSameLocation(url) ? window.location.reload() : navigate(url);
  };

  const handleKey = async (e) => {
    if (e.code === 'Enter' && searchText !== '') {
      await handleSearch(searchText, performAction, network);
    }
  };

  return (
    <>
      <div className={styles.searchBar} onKeyDown={(e) => handleKey(e)}>
        <input
          onChange={(e) => setSearchText(e.target.value)}
          className={styles.searchInput}
          placeholder="Search by address, snapshot, or transaction..."
        />
        <input
          onChange={(e) => setSearchText(e.target.value)}
          className={styles.shortSearchInput}
          placeholder="Search network"
        />
        <div className={styles.searchBlock}>
          <div className={styles.searchLeft}>
            <div className={styles.searchIcon} />
          </div>
        </div>
        <div
          className={`${styles.searchButton} ${styles.normal}`}
          onClick={() => {
            handleSearch(searchText, performAction, network);
          }}
        >
          <p> Search </p>
        </div>
      </div>
      <div
        className={`${styles.searchButton} ${styles.oldIos}`}
        onClick={() => {
          handleSearch(searchText, performAction, network);
        }}
      >
        <p> Search </p>
      </div>
    </>
  );
};
