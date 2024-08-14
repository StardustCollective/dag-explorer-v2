import { Link } from 'react-router-dom';
import { ReactComponent as CheckmarkIcon } from '../../../../assets/icons/Checkmark.svg';

import styles from './component.module.scss';
import clsx from 'clsx';

export type ISelectMenuItemProps = {
  content: string;
  selected?: boolean;
  linkTo?: string;
  onClick?: () => void;
};

export const SelectMenuItem = ({ content, selected, linkTo, onClick }: ISelectMenuItemProps) => {
  if (linkTo) {
    return (
      <Link className={clsx(styles.main, selected && styles.selected)} to={linkTo} onClick={onClick}>
        <span>{content}</span>
        {selected && <CheckmarkIcon />}
      </Link>
    );
  }

  return (
    <div className={clsx(styles.main, selected && styles.selected)} onClick={onClick}>
      <span>{content}</span>
      {selected && <CheckmarkIcon />}
    </div>
  );
};
