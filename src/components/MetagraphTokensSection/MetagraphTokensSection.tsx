import { AddressMetagraphResponse } from '../../types';
import { MetagraphTokensBalances } from './components/MetagraphTokensBalances';

import styles from './MetagraphTokensSection.module.scss';

type MetagraphTokensProps = {
  metagraphTokens: AddressMetagraphResponse[];
  defaultOption: AddressMetagraphResponse;
  skeleton?: boolean;
};

export const MetagraphTokensSection = ({ metagraphTokens, defaultOption, skeleton }: MetagraphTokensProps) => {
  return (
    <div className={styles.metagraphTokensOverview}>
      <span>Token balance</span>
      {skeleton ? (
        <div className={`${styles.skeleton} ${styles.value}`} />
      ) : (
        <MetagraphTokensBalances metagraphTokens={metagraphTokens} defaultOption={defaultOption} />
      )}
    </div>
  );
};
