import { useEffect, useState } from 'react';
import { ValidatorNode } from '../../types';
import { InfoHeader } from '../InfoHeader/InfoHeader';
import { SkeletonValidatorRows } from './SkeletonValidatorRows';
import { ValidatorRow } from './ValidatorRow';
import { HeaderRow } from '../TransactionsTable/HeaderRow';
import styles from './ValidatorsTable.module.scss';
import { CardDataRow, TableCards } from '../TransactionsTable/TableCards';
import { fitStringInCell } from '../../utils/numbers';

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
  const [rows, setRows] = useState<ValidatorNode[]>([]);
  const [elements, setElements] = useState<Set<CardDataRow[]>>(new Set<[]>);

  useEffect(() => {
    if (nodes.length < amount) {
      setRows(nodes.concat(...new Array<ValidatorNode>(amount - nodes.length).fill(undefined)));
    } else {
      setRows(nodes);
    }
  }, [nodes]);

  useEffect(() => {
    if(rows.length > 0){
      const validatorsCards = new Set<CardDataRow[]>();
      rows.forEach((node)=>{
        if(node){
          const validatorCard: CardDataRow[] = [];
          validatorCard.push({value: node.ip});
          validatorCard.push({value: node.upTime});
          validatorCard.push({value: node.status});
          validatorCard.push({value: node.latency ? node.latency : 'Unkown'});
          validatorCard.push({value: fitStringInCell(node.address), linkTo: '/address/' + node.address});
          validatorsCards.add(validatorCard);
        }        
      });
      setElements(validatorsCards);
    }
  }, [rows]);

  return (
    <>
      <div className={styles.tableContainer}>
        <InfoHeader title={'Node Validators'} />
        <div className={styles.table}>
          <HeaderRow headerCols={HEADERS} />
          {!loading ? (
            rows.map((node, idx) => (
              <ValidatorRow
                node={node}
                key={node?.id || idx}
                variant={idx % 2 === 0 ? styles.rowVariantWhite : undefined}
              />
            ))
          ) : (
            <SkeletonValidatorRows amountRows={rows.length} variant={styles.rowVariantWhite} />
          )}
        </div>
      </div>
      <div className={styles.tableCards}>
        <TableCards limit={amount} showSkeleton={loading} titles={HEADERS} headerText={'Node Validators'} elements={elements}/>
      </div>
    </>
  );
};
