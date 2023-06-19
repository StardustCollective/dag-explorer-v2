import { AddressMetagraphResponse } from '../../types';
import { MetagraphTokensBalances } from './components/MetagraphTokensBalances';

import styles from './MetagraphTokensSection.module.scss';

type MetagraphTokensProps = {
  metagraphTokens: AddressMetagraphResponse[];
  selectedOption: AddressMetagraphResponse;
  skeleton?: boolean;
  setSelectedMetagraph: (metagraph: AddressMetagraphResponse) => void;
  setTokenChanged: (changed: boolean) => void
};

export const MetagraphTokensSection = ({
  metagraphTokens,
  selectedOption,
  skeleton,
  setSelectedMetagraph,
  setTokenChanged
}: MetagraphTokensProps) => {
  return (
    <div className={styles.metagraphTokensOverview}>
      <span>Token balance</span>
      {skeleton ? (
        <div className={`${styles.skeleton} ${styles.value}`} />
      ) : (
        <MetagraphTokensBalances
          metagraphTokens={metagraphTokens}
          selectedOption={selectedOption}
          setSelectedMetagraph={setSelectedMetagraph}
          setTokenChanged={setTokenChanged}
        />
      )}
    </div>
  );
};
