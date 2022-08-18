import { Link } from 'react-router-dom';
import { MainnetOneSnapshot, MainnetOneTransaction, Snapshot, Transaction, ValidatorNode } from '../../types';
import { fitStringInCell, formatAmount, formatTime } from '../../utils/numbers';
import styles from './MobileCard.module.scss';
import CopyIcon from '../../assets/icons/Copy.svg';
import ReactTooltip from 'react-tooltip';
import { SkeletonMobileCard } from './SkeletonMobileCard';
import { useState } from 'react';
import { SnapshotShape } from '../Shapes/SnapshotShape';
import { TransactionShape } from '../Shapes/TransactionShape';

const getSnapshotElements = (snapshot: Snapshot) => {
  const content: JSX.Element[] = [];

  content.push(
    <p key={0} className={styles.hash}>
      <SnapshotShape />
      <Link to={'/snapshots/' + snapshot.ordinal}>{snapshot.ordinal}</Link>
    </p>
  );

  content.push(
    <div key={1}>
      <p className={styles.hash} data-tip={formatTime(snapshot.timestamp, 'full')}>
        {formatTime(snapshot.timestamp, 'relative')}
      </p>
      <ReactTooltip />
    </div>
  );

  content.push(
    <p key={2} className={styles.hash}>
      {snapshot.blocks.length}
    </p>
  );

  return content;
};

const getTransactionElements = (transaction: Transaction, handleCopyToClipboard: (value: string) => void) => {
  const content: JSX.Element[] = [];

  content.push(
    <p className={styles.hash} key={1}>
      <TransactionShape />
      <Link to={'/transactions/' + transaction.hash}>{fitStringInCell(transaction.hash)}</Link>
      {<img className={`${styles.copy}`} src={CopyIcon} onClick={() => handleCopyToClipboard(transaction.hash)} />}
    </p>
  );

  content.push(
    <div key={2}>
      <p className={styles.hash} data-tip={formatTime(transaction.timestamp, 'full')}>
        {formatTime(transaction.timestamp, 'relative')}
      </p>
      <ReactTooltip />
    </div>
  );
  content.push(
    <p className={styles.hash} key={3}>
      <Link to={'/snapshots/' + transaction.snapshotOrdinal}>{transaction.snapshotOrdinal}</Link>
    </p>
  );
  content.push(
    <p className={styles.hash} key={4}>
      <Link to={'/address/' + transaction.source}>{fitStringInCell(transaction.source)}</Link>
      {<img className={`${styles.copy}`} src={CopyIcon} onClick={() => handleCopyToClipboard(transaction.hash)} />}
    </p>
  );
  content.push(
    <div className={styles.hash} key={5}>
      <p>
        <Link to={'/address/' + transaction.destination}>{fitStringInCell(transaction.destination)}</Link>
      </p>
      {<img className={`${styles.copy}`} src={CopyIcon} onClick={() => handleCopyToClipboard(transaction.hash)} />}
    </div>
  );
  content.push(
    <p className={styles.hash} key={6}>
      {formatAmount(transaction.amount, 8)}
    </p>
  );

  return content;
};

const getMainnetOneSnapElements = (snap: MainnetOneSnapshot) => {
  const content: JSX.Element[] = [];
  content.push(
    <p key={0} className={styles.hash}>
      <SnapshotShape />
      <Link to={'/snapshots/' + snap.height}>{snap.height}</Link>
    </p>
  );

  content.push(
    <div key={1}>
      <p className={styles.hash}>{formatAmount(snap.dagAmount, 8)}</p>
    </div>
  );

  content.push(
    <p key={2} className={styles.hash}>
      {snap.txCount}
    </p>
  );
  return content;
};

const getMainnetOneTxElements = (tx: MainnetOneTransaction, handleCopyToClipboard: (value: string) => void) => {
  const content: JSX.Element[] = [];

  content.push(
    <p className={styles.hash} key={1}>
      <TransactionShape />
      <Link to={'/transactions/' + tx.hash}>{fitStringInCell(tx.hash)}</Link>
      {<img className={`${styles.copy}`} src={CopyIcon} onClick={() => handleCopyToClipboard(tx.hash)} />}
    </p>
  );

  content.push(
    <div key={2}>
      <p className={styles.hash} data-tip={formatTime(tx.timestamp, 'full')}>
        {formatTime(tx.timestamp, 'relative')}
      </p>
      <ReactTooltip />
    </div>
  );

  content.push(
    <p className={styles.hash} key={4}>
      <Link to={'/address/' + tx.sender}>{fitStringInCell(tx.sender)}</Link>
      {<img className={`${styles.copy}`} src={CopyIcon} onClick={() => handleCopyToClipboard(tx.sender)} />}
    </p>
  );
  content.push(
    <div className={styles.hash} key={5}>
      <p>
        <Link to={'/address/' + tx.receiver}>{fitStringInCell(tx.receiver)}</Link>
      </p>
      {<img className={`${styles.copy}`} src={CopyIcon} onClick={() => handleCopyToClipboard(tx.receiver)} />}
    </div>
  );
  content.push(
    <p className={styles.hash} key={6}>
      {formatAmount(tx.amount, 8)}
    </p>
  );

  return content;
};

const getValidatorNodeElements = (node: ValidatorNode) => {
  const content: JSX.Element[] = [];

  content.push(
    <div key={1}>
      <p className={styles.hash}>{node.ip}</p>
    </div>
  );

  content.push(
    <div key={2}>
      <p className={styles.hash}>{node.upTime}</p>
    </div>
  );

  content.push(
    <div key={3}>
      <p className={styles.hash}>{node.status}</p>
    </div>
  );

  content.push(
    <div key={4}>
      <p className={styles.hash}>{node.latency ? node.latency : 'Unknown'}</p>
    </div>
  );

  content.push(
    <div className={styles.hash} key={5}>
      <p>
        <Link to={'/address/' + node.address}>{fitStringInCell(node.address)}</Link>
      </p>
    </div>
  );

  return content;
};

export const MobileCard = ({
  titles,
  snapshot,
  transaction,
  validatorNode,
  isSkeleton,
  mainnetOneSnap,
  mainnetOneTx,
}: {
  titles: string[];
  snapshot?: Snapshot;
  transaction?: Transaction;
  validatorNode?: ValidatorNode;
  isSkeleton?: boolean;
  mainnetOneSnap?: MainnetOneSnapshot;
  mainnetOneTx?: MainnetOneTransaction;
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

  const handleCopyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const infoElements: JSX.Element[] = snapshot
    ? getSnapshotElements(snapshot)
    : transaction
    ? getTransactionElements(transaction, handleCopyToClipboard)
    : mainnetOneSnap
    ? getMainnetOneSnapElements(mainnetOneSnap)
    : mainnetOneTx
    ? getMainnetOneTxElements(mainnetOneTx, handleCopyToClipboard)
    : validatorNode
    ? getValidatorNodeElements(validatorNode)
    : null;

  return (
    <div className={styles.cardContainer}>
      <div className={styles.titleContainer}>{titleElements}</div>
      <div className={styles.infoContainer}>{infoElements}</div>
      {copied && <div className={`${styles.copied} ${styles.fade}`}>Value copied to clipboard!</div>}
    </div>
  );
};
