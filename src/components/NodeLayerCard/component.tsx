import React from 'react';

import { ReactComponent as EdgeNodeAltIcon } from '../../assets/icons/EdgeNodeAlt.svg';

import styles from './component.module.scss';
import clsx from 'clsx';
import { CopyableContent } from '../CopyableContent/component';

export type INodeLayerCardProps = { className?: string; layerName: string; nodesOnline: number; nodeUrl: string };

export const NodeLayerCard = ({ className, layerName, nodesOnline, nodeUrl }: INodeLayerCardProps) => {
  return (
    <div className={clsx(styles.main, className)}>
      <div className={styles.layerInfo}>
        <div className={styles.title}>
          <div className={styles.validators}>
            <EdgeNodeAltIcon />
            <span>Validators</span>
          </div>
          <span className={styles.layerName}>{layerName}</span>
        </div>
        <div className={styles.nodes}>
          <span>{nodesOnline}</span>
        </div>
      </div>
      <span>
        <span>{nodeUrl}</span>
        <CopyableContent className={styles.copyIcon} content={nodeUrl} />
      </span>
    </div>
  );
};
