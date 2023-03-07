import React, { useState } from 'react';
import cls from 'classnames';

import { ReactComponent as ChevronUpIcon } from '../../assets/icons/chevron-up.svg';
import { ReactComponent as ChevronDownIcon } from '../../assets/icons/chevron-down.svg';

import { Button } from '../Buttons/Button';

import styles from './component.module.scss';
import { DropdownList, DropdownListItem } from './components';

type DropdownOptionType<T> = {
  value: T;
  content: React.ReactNode;
};

const Dropdown = <T,>({
  options,
  onOptionClick,
  children,
  className,
}: {
  options: DropdownOptionType<T>[];
  onOptionClick?: (value: T) => void;
  children?: React.ReactNode;
  className?: { button: string; dropdownList?: string };
}): JSX.Element => {
  const [open, setOpen] = useState(false);

  return (
    <Button
      variants={['right-icon']}
      className={cls(styles.root, className?.button)}
      rightIcon={open ? <ChevronUpIcon width={16} height={16} /> : <ChevronDownIcon width={16} height={16} />}
      onClick={(e) => {
        setOpen(!open);
        e.preventDefault();
      }}
    >
      {children}
      {open && (
        <DropdownList className={className?.dropdownList}>
          {options.map((option, index) => (
            <DropdownListItem
              key={index}
              onClick={() => {
                onOptionClick && onOptionClick(option.value);
                setOpen(false);
              }}
            >
              {option.content}
            </DropdownListItem>
          ))}
        </DropdownList>
      )}
    </Button>
  );
};

export { Dropdown, type DropdownOptionType };
