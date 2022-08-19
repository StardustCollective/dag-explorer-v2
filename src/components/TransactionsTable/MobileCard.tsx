import { Link } from 'react-router-dom';
import styles from './MobileCard.module.scss';
import CopyIcon from '../../assets/icons/Copy.svg';
import ReactTooltip from 'react-tooltip';
import { SkeletonMobileCard } from './SkeletonMobileCard';
import { useState } from 'react';
import { CardDataRow } from './TableCards';

const getElementContent = (dataRows: CardDataRow[], handleCopyToClipboard: (value: string) => void) => {
  const card: JSX.Element[] = [];

  dataRows.forEach((rowData) => {
    card.push(
      <div>
        <p className={styles.hash} data-tip={rowData.dataTip ? rowData.dataTip : null}>
          {rowData.element && rowData.element}
          {rowData.value && !rowData.linkTo && rowData.value}
          {rowData.linkTo && <Link to={rowData.linkTo}>{rowData.value}</Link>}
          {rowData.toCopy && (
            <img className={`${styles.copy}`} src={CopyIcon} onClick={() => handleCopyToClipboard(rowData.toCopy)} />
          )}
        </p>
        {rowData.dataTip && <ReactTooltip />}
      </div>
    );
  });

  return card;
};

export const MobileCard = ({
  titles,
  cardData,
  isSkeleton,
}: {
  titles: string[];
  cardData: CardDataRow[];
  isSkeleton?: boolean;
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const titleElements: JSX.Element[] = titles.map((t, index) => (
    <p className={styles.cardTitle} key={index}>
      {t}
    </p>
  ));

  if (isSkeleton) {
    return <SkeletonMobileCard titleElements={titleElements} />;
  }
  if (cardData.length === 0) {
    return;
  }

  const handleCopyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const infoElement = getElementContent(cardData, handleCopyToClipboard);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.titleContainer}>{titleElements}</div>
      <div className={styles.infoContainer}>{infoElement}</div>
      {copied && <div className={`${styles.copied} ${styles.fade}`}>Value copied to clipboard!</div>}
    </div>
  );
};
