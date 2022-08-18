import { useEffect, useState } from 'react';
import { ValidatorNode } from '../../types';
import { InfoHeader } from '../InfoHeader/InfoHeader';
import { TableCards } from '../TransactionsTable/TableCards';
import { HeaderRow } from './HeaderRow';
import { SkeletonValidatorRows } from './SkeletonValidatorRows';
import { ValidatorRow } from './ValidatorRow';
import styles from './ValidatorsTable.module.scss';

const HEADERS = ['NODE', 'UP TIME', 'STATUS', 'LATENCY', 'ADDRESS'];

export const ValidatorsTable = ({
  nodes,
  amount,
  loading,
}: {
  nodes: ValidatorNode[];
  amount: number;
  loading: boolean;
}) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (nodes.length < amount) {
      setRows(nodes.concat(...new Array<ValidatorNode>(amount - nodes.length).fill(undefined)));
    } else {
      setRows(nodes);
    }
  }, [nodes]);

  return (
    <>
      <div className={styles.tableContainer}>
        <InfoHeader title={'Node Validators'} />
        <div className={styles.table}>
          <HeaderRow headers={HEADERS} />
          {!loading ? (
            rows.map((node, idx) => (
              <ValidatorRow
                node={node}
                key={node?.id || idx}
                variant={idx % 2 === 0 ? styles.rowVariantWhite : undefined}
              />
            ))
          ) : (
            <SkeletonValidatorRows variant={styles.rowVariantWhite} />
          )}
        </div>
      </div>
      <div className={styles.tableCards}>
        <TableCards
          limit={amount}
          showSkeleton={loading}
          titles={HEADERS}
          headerText={'Node Validators'}
          validatorNodes={rows}
        />
      </div>
    </>
  );
};
