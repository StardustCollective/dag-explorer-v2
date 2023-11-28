import clsx from 'clsx';
import { Skeleton, AddressRewardsResponse } from '../../types';
import { HeaderRow } from './HeaderRow';
import { RewardRow } from './RewardRow';
import { SkeletonTransactionsTable } from './SkeletonRewardsTable';
import { useContext, cloneElement } from 'react';
import { PricesContext, PricesContextType } from '../../context/PricesContext';
import { CardDataRow, TableCards } from './TableCards';
import { fitStringInCell, formatAmount, formatTime } from '../../utils/numbers';

import styles from './RewardsTable.module.scss';

export const RewardsTable = ({
  skeleton,
  rewards,
  icon,
  headerText,
  limit,
  showMetagraphSymbol,
}: {
  skeleton?: Skeleton;
  rewards?: AddressRewardsResponse[];
  icon?: JSX.Element;
  headerText?: string;
  limit?: number;
  showMetagraphSymbol?: boolean;
}) => {
  const { dagInfo } = useContext(PricesContext) as PricesContextType;

  const titles = ['SENT TO', 'ORDINAL', 'AMOUNT', 'TIMESTAMP'];

  const needDagInfo = rewards && rewards.length > 0;
  const mql = window.matchMedia('(max-width: 580px)');

  if ((skeleton && skeleton.showSkeleton) || (needDagInfo && !dagInfo)) {
    return mql.matches ? (
      <div className={styles.cards}>
        <TableCards limit={limit} showSkeleton={skeleton.showSkeleton} titles={titles} />
      </div>
    ) : (
      <SkeletonTransactionsTable
        headerCols={skeleton.headerCols}
        rows={limit}
        headerText={headerText}
        icon={icon}
        showMetagraphSymbol={showMetagraphSymbol}
      />
    );
  }

  let txRows =
    rewards &&
    rewards.length > 0 &&
    rewards.map((reward, idx) => (
      <RewardRow
        dagInfo={dagInfo}
        key={reward.address + reward.ordinal}
        reward={reward}
        icon={icon}
        isLastRow={rewards.length >= limit && idx + 1 === rewards.length}
      />
    ));

  const emptyRows = [];
  for (let i = 0; i < limit; i++) {
    emptyRows.push(<RewardRow key={i} reward={null} isLastRow={i + 1 === limit} />);
  }
  if (!rewards || rewards.length === 0) {
    txRows = emptyRows;
  }

  if (txRows && limit && txRows.length < limit) {
    let i = 0;
    while (txRows.length < limit) {
      txRows.push(<RewardRow key={i} />);
      i++;
    }
  }

  const cardsSet = new Set<CardDataRow[]>();
  if (rewards) {
    rewards.forEach((reward) => {
      const txCard: CardDataRow[] = [];
      txCard.push({
        value: fitStringInCell(reward.address),
        linkTo: '/address/' + reward.address,
        toCopy: reward.address,
      });
      txCard.push({
        value: reward.ordinal,
        linkTo: reward.metagraphId
          ? `/metagraphs/${reward.metagraphId}/snapshots/${reward.ordinal}`
          : '/snapshots/' + reward.ordinal,
      });
      txCard.push({ value: formatAmount(reward.amount, 8, false, reward.symbol) });
      txCard.push({ value: formatTime(reward.accruedAt, 'relative'), dataTip: formatTime(reward.accruedAt, 'full') });

      cardsSet.add(txCard);
    });
  }

  return (
    <>
      <div className={clsx(styles.table, styles.container)}>
        {headerText && <div className={styles.headerText}>{headerText}</div>}
        {headerText && <span />}
        {showMetagraphSymbol && headerText && <span />}
        {headerText && cloneElement(icon, { classname: styles.icon, size: '20px' })}
        <HeaderRow />
        {rewards && txRows}
        {!rewards && emptyRows}
      </div>
      <div className={styles.cards}>
        <TableCards titles={titles} elements={cardsSet} headerText={headerText} icon={icon} />
      </div>
    </>
  );
};
