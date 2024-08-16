import { cloneElement } from 'react';
import { MobileCard } from './MobileCard';
import styles from './TransactionsTable.module.scss';

export type CardDataRow = {
  value?: string | number;
  linkTo?: string;
  toCopy?: string;
  dataTip?: string;
  element?: JSX.Element;
};

export const TableCards = ({
  showSkeleton,
  titles,
  limit,
  headerText,
  icon,
  elements,
  emptyStateLabel,
}: {
  showSkeleton?: boolean;
  titles?: string[];
  limit?: number;
  headerText?: string;
  icon?: JSX.Element;
  elements?: Set<CardDataRow[]>;
  emptyStateLabel?: string;
}) => {
  const header = headerText && (
    <div className={styles.headerCards} key={'headerText'}>
      <div className={styles.headerText}>{headerText}</div>
      <span />
      {icon && cloneElement(icon, { classname: styles.icon, size: '20px' })}
    </div>
  );
  const content: JSX.Element[] = [];
  header && content.push(header);

  elements &&
    elements.size > 0 &&
    elements.forEach((elem) => content.push(<MobileCard titles={titles} cardData={elem} key={Math.random()} />));

  if (showSkeleton) {
    for (let i = 0; i < limit; i++) {
      content.push(<MobileCard titles={titles} key={i} cardData={[]} isSkeleton />);
    }
  }

  if ((header && content.length === 1) || content.length === 0) {
    return (
      <div className={styles.emptyStateLabel}>
        {emptyStateLabel}
      </div>
    );
  }

  return <>{content}</>;
};
