import { FC, ReactNode } from 'react';
import styles from './Button.module.scss';

type ButtonProps<RenderElementProps = JSX.IntrinsicElements['button']> = {
  children: ReactNode;
  variant?: string;
  variants?: 'right-icon'[];
  rightIcon?: React.ReactNode;
  className?: string;
} & RenderElementProps;

export const Button: FC<ButtonProps> = ({
  children,
  variant,
  variants,
  rightIcon,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button className={`${styles.button} ${variant} ${className}`} {...props}>
      {children}
      {variants?.includes('right-icon') && <div className={styles.iconHolder}>{rightIcon}</div>}
    </button>
  );
};
