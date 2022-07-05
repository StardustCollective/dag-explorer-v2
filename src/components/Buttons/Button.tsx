import { FC, ReactNode } from 'react';
import styles from './Button.module.scss';

interface IButton {
  children: ReactNode;
  onClick?: () => void;
  variant?: string;
}

export const Button: FC<IButton> = ({ children, onClick, variant }) => {
  return (
    <div className={`${styles.button} ${variant}`} onClick={onClick}>
      {children}
    </div>
  );
};
