import React from 'react';
import cls from 'classnames';
import ReactTooltip, { type Place } from 'react-tooltip';

import { DatePickerRow } from './components';
import styles from './component.module.scss';

const InputRowBase = React.forwardRef<
  HTMLInputElement,
  {
    variants?: ('full-width' | 'disabled' | 'indent')[];
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    leftIcon?: JSX.Element;
    labelIcon?: React.ReactNode;
    iconTooltip?: string;
    tooltipPlace?: Place;
    tooltipBgColor?: string;
    tooltipClass?: string;
    onIconClick?: () => void;
    classNames?: {
      root?: string;
      label?: string;
      input?: string;
      inputWrapper?: string;
      error?: string;
      icon?: string;
      labelIcon?: string;
    };
  } & JSX.IntrinsicElements['input']
>(
  (
    {
      variants,
      label,
      error,
      icon,
      leftIcon,
      labelIcon,
      iconTooltip,
      tooltipPlace,
      tooltipBgColor,
      tooltipClass,
      onIconClick,
      classNames,
      type,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cls(styles.root, variants?.includes('full-width') && styles.fullWidth, classNames?.root)}>
        {label && (
          <label className={cls(styles.label, classNames?.label)}>
            {label}
            {labelIcon && (
              <p
                data-tip={iconTooltip}
                data-place={tooltipPlace}
                data-background-color={tooltipBgColor}
                data-html={true}
                data-multiline={true}
                data-class={tooltipClass}
                className={styles.noMargin}
              >
                {labelIcon}
              </p>
            )}
            {iconTooltip && <ReactTooltip />}
          </label>
        )}
        <div className={cls(styles.inputWrapper, classNames?.inputWrapper)}>
          {leftIcon && <div className={cls(styles.leftIcon, classNames?.icon)}>{leftIcon}</div>}
          <input
            {...props}
            {...{ type, value, defaultValue }}
            className={cls(
              styles.input,
              variants?.includes('disabled') && styles.disabled,
              variants?.includes('indent') && styles.indent,
              error && cls(styles.error, classNames?.error),
              classNames?.input
            )}
            ref={ref}
          />
          <div
            className={cls(styles.icon, classNames?.icon)}
            onClick={(e) => {
              e.stopPropagation();
              onIconClick && onIconClick();
            }}
          >
            {icon}
          </div>
        </div>
        {error && <span className={cls(styles.error, classNames?.error)}>{error}</span>}
      </div>
    );
  }
);

const InputRow = Object.assign(InputRowBase, {
  DatePicker: DatePickerRow,
});

InputRowBase.displayName = 'InputRow';

export { InputRow };
