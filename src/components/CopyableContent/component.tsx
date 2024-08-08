import React, { useMemo, useState } from 'react';
import { Tooltip } from 'react-tooltip-v5';
import clsx from 'clsx';

import { ReactComponent as CopyIcon } from '../../assets/icons/Copy.svg';

import styles from './component.module.scss';

export type ICopyableContentProps = { className?: string; content: string };

export const CopyableContent = ({ className, content }: ICopyableContentProps) => {
  const copyId = useMemo(() => `copyid::${Math.random()}`, []);
  const [copied, setCopied] = useState(false);

  const doCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <>
      <CopyIcon
        className={clsx(styles.main, className)}
        onClick={doCopy}
        data-tooltip-id={copyId}
        data-tooltip-content={copied ? 'Copied to Clipboard!' : ''}
      />
      <Tooltip id={copyId} />
    </>
  );
};
