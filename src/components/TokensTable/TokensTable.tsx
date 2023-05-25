import { useEffect, useState } from 'react';
import { MetagraphToken } from '../../types';
import { SkeletonTokenRows } from './SkeletonTokenRows';
import { TokenRow } from './TokenRow';
import { HeaderRow } from '../TransactionsTable/HeaderRow';
import styles from './TokensTable.module.scss';
import { CardDataRow, TableCards } from '../TransactionsTable/TableCards';

const HEADERS = ['TOKEN', 'SYMBOL', 'TOKEN PRICE', 'BALANCE'];
const MINIMUM_TABLE_LENGTH = 5;
export const TokensTable = ({
  metagraphTokens,
  amount,
  loading,
}: {
  metagraphTokens: MetagraphToken[];
  amount: number;
  loading: boolean;
}) => {
  const [rows, setRows] = useState<MetagraphToken[]>([]);
  const [elements, setElements] = useState<Set<CardDataRow[]>>(new Set<[]>);

  useEffect(() => {
    if (metagraphTokens.length < MINIMUM_TABLE_LENGTH) {
      setRows(metagraphTokens.concat(...new Array<MetagraphToken>(amount - metagraphTokens.length).fill(undefined)));
    } else {
      setRows(metagraphTokens);
    }
  }, [metagraphTokens]);

  useEffect(() => {
    if(rows.length > 0){
      const tokensCards = new Set<CardDataRow[]>();
      rows.forEach((node)=>{
        if(node){
          const tokenCard: CardDataRow[] = [];
          tokenCard.push({
            value: node.name,
            element: <img src={node.icon} className={styles.metagraphIcon}/>
          });
          tokenCard.push({value: node.symbol});
          tokenCard.push({value: node.price});
          tokenCard.push({value: node.balance});
          tokensCards.add(tokenCard);
        }        
      });
      setElements(tokensCards);
    }
  }, [rows]);

  return (
    <>
      <div className={styles.tableContainer}>
        <div className={styles.table}>
          <HeaderRow headerCols={HEADERS} />
          {!loading ? (
            rows.map((metagraphToken, idx) => (
              <TokenRow
                metagraphToken={metagraphToken}
                key={metagraphToken?.name || idx}
                variant={idx % 2 === 0 ? styles.rowVariantWhite : undefined}
              />
            ))
          ) : (
            <SkeletonTokenRows amountRows={5} variant={styles.rowVariantGray} />
           )} 
        </div>
      </div>
      <div className={styles.tableCards}>
        <TableCards limit={amount} showSkeleton={loading} titles={HEADERS} elements={elements}/>
      </div>
    </>
  );
};
