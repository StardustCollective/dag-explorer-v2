import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useGetClusterInfo, useGetValidatorNodes } from '../../api/l0-node';
import { InfoTable } from '../../components/InfoTable/InfoTable';
import TableController from '../../components/ValidatorsTable/TableController';
import { ValidatorsTable } from '../../components/ValidatorsTable/ValidatorsTable';
import { ValidatorNode } from '../../types';
import styles from './Dashboard.module.scss';

const NODES_AMOUNT = 10;

export const Dashboard = ({ network }: { network: 'testnet' | 'mainnet' | 'mainnet1' }) => {
  const validatorNodes = useGetValidatorNodes(network);
  const [nodes, setNodes] = useState<ValidatorNode[]>([]);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const clusterData = useGetClusterInfo();
  const [validatorsAmount, setValidatorsAmount] = useState(0);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(0);
  const [skeleton, setSkeleton] = useState(true);

  useEffect(() => {
    if (!validatorNodes.isFetching && !validatorNodes.isError) {
      setNodes(validatorNodes.data);
      setPages(Math.ceil(validatorNodes.data.length / 10));
    }
    if (!clusterData.isError && !clusterData.isFetching) {
      setValidatorsAmount(clusterData.data.length);
      setLastUpdatedAt(clusterData.dataUpdatedAt);
    }
    if (!clusterData.isFetching && !validatorNodes.isFetching) {
      setSkeleton(false);
    }
  }, [validatorNodes.isFetching, clusterData.isFetching]);

  const handlePrevPage = () => {
    if (currentPage === 1) {
      return;
    }
    setCurrentPage((page) => page - 1);
  };
  const handleNextPage = () => {
    if (currentPage === pages) {
      return;
    }
    setCurrentPage((page) => page + 1);
  };

  return (
    <>
      <main className={clsx(styles.unifiedRow, 'background')}>
        <div className={'row'}>
          {network === 'testnet' && (
            <>
              <InfoTable
                title={'Cluster Metrics'}
                loading={skeleton}
                validatorsAmount={validatorsAmount}
                lastUpdatedAt={lastUpdatedAt}
              />
              <ValidatorsTable
                nodes={nodes.slice(currentPage * NODES_AMOUNT - NODES_AMOUNT, currentPage * NODES_AMOUNT)}
                amount={NODES_AMOUNT}
                loading={skeleton}
              />
              <TableController
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                firstPage={currentPage === 1}
                lastPage={currentPage === pages}
              />
            </>
          )}
        </div>
      </main>
    </>
  );
};
