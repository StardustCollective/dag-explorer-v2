import { useEffect, useState } from 'react';
import { MetagraphInfo } from '../../types';
import { SkeletonTokenRows } from './SkeletonTokenRows';
import { TokenRow } from './TokenRow';
import { HeaderRow } from '../TransactionsTable/HeaderRow';
import styles from './TokensTable.module.scss';
import { CardDataRow, TableCards } from '../TransactionsTable/TableCards';

const HEADERS = ['TOKEN', 'SYMBOL', 'TOKEN PRICE', 'BALANCE'];
export const TokensTable = ({
  metagraphTokens,
  amount,
  loading,
}: {
  metagraphTokens: MetagraphInfo[];
  amount: number;
  loading: boolean;
}) => {
  const [rows, setRows] = useState<MetagraphInfo[]>([]);
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
          tokenCard.push({value: 10});
          tokenCard.push({value: 10});
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
                key={metagraphToken?.metagraphName || idx}
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
