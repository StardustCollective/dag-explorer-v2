import { useEffect, useState } from 'react';
import { AddressMetagraphResponse } from '../../types';
import { SkeletonTokenRows } from './SkeletonTokenRows';
import { TokenRow } from './TokenRow';
import { HeaderRow } from '../TransactionsTable/HeaderRow';
import { CardDataRow, TableCards } from '../TransactionsTable/TableCards';
import { fitStringInCell, formatAmount } from '../../utils/numbers';

import styles from './TokensTable.module.scss';

const HEADERS = ['TOKEN', 'SYMBOL', 'METAGRAPH ID', 'BALANCE'];
export const TokensTable = ({
  metagraphTokens,
  amount,
  loading,
}: {
  metagraphTokens: AddressMetagraphResponse[];
  amount: number;
  loading: boolean;
}) => {
  const [rows, setRows] = useState<AddressMetagraphResponse[]>([]);
  const [elements, setElements] = useState<Set<CardDataRow[]>>(new Set<[]>);

  useEffect(() => {
      setRows(metagraphTokens);
  }, [metagraphTokens]);

  useEffect(() => {
    if(rows.length > 0){
      const tokensCards = new Set<CardDataRow[]>();
      rows.forEach((node)=>{
        if(node){
          const tokenCard: CardDataRow[] = [];
          tokenCard.push({
            value: node.metagraphName,
            element: <img src={node.metagraphIcon} className={styles.metagraphIcon}/>
          });
          tokenCard.push({value: node.metagraphSymbol});
          tokenCard.push({value: fitStringInCell(node.metagraphId, 8), toCopy: node.metagraphId});
          tokenCard.push({value: formatAmount(node.balance, 6, false, '')});
          tokensCards.add(tokenCard);
        }        
      });
      setElements(tokensCards);
    }
  }, [rows]);

  const emptyRows = [];
  for (let i = 0; i < amount; i++) {
    emptyRows.push(<TokenRow key={i} />);
  }

  return (
    <>
      <div className={styles.tableContainer}>
        <div className={styles.table}>
          <HeaderRow headerCols={HEADERS} />
          {!loading ? (
            <>
            {rows.length > 0 ? (rows.map((metagraphToken, idx) => (
              <TokenRow
                metagraphToken={metagraphToken}
                key={metagraphToken?.metagraphName || idx}
                variant={idx % 2 === 0 ? styles.rowVariantWhite : undefined}
              />
            ))) : (
              emptyRows
            )}
            </>
          ) : (
            <SkeletonTokenRows amountRows={amount} variant={styles.rowVariantGray} />
           )} 
        </div>
      </div>
      <div className={styles.tableCards}>
        <TableCards limit={amount} showSkeleton={loading} titles={HEADERS} elements={elements}/>
      </div>
    </>
  );
};
