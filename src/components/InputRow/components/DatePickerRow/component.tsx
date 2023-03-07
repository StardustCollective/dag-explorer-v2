import React from 'react';
import cls from 'classnames';
import DatePicker from 'react-datepicker';

import CalendarIcon from '../../../../assets/icons/CalendarBlank.svg';
import styles from '../../component.module.scss';

const DatePickerRow = ({
  variants,
  label,
  error,
  icon,
  onChange,
  disabled,
  selected,
  onIconClick,
  className,
  showTimeSelect,
  showTimeInput,
  dateFormat,
  timeIntervals,
  minDate,
  maxDate,
  filterTime,
  ...props
}: {
  variants?: ('full-width' | 'indent')[];
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  selected?: Date | null;
  disabled?: boolean;
  showTimeSelect?: boolean;
  showTimeInput?: boolean;
  dateFormat?: string | string[];
  timeIntervals?: number;
  minDate?: Date | null;
  maxDate?: Date | null;
  onChange?: (value: Date | null) => void;
  onIconClick?: React.MouseEventHandler<HTMLDivElement>;
  filterTime?: (date: Date) => boolean;
  className?: {
    root?: string;
    label?: string;
    input?: string;
    inputWrapper?: string;
    error?: string;
    icon?: string;
  };
}) => {
  return (
    <div className={cls(styles.root, variants?.includes('full-width') && styles.fullWidth, className?.root)}>
      {label && <label className={cls(styles.label, className?.label)}>{label}</label>}
      <div className={cls(styles.inputWrapper, className?.inputWrapper)}>
        <div className={cls(styles.leftIcon)}>
          <img className={styles.navSeparator} src={CalendarIcon} />
        </div>
        <DatePicker
          {...props}
          selected={selected}
          onChange={(date) => onChange && onChange(date)}
          dateFormat="MM/dd/yyyy"
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          filterTime={filterTime}
          timeIntervals={15}
          showTimeSelect={showTimeSelect}
          showTimeInput={showTimeInput}
          className={cls(
            styles.input,
            error && cls(styles.error, className?.error),
            variants?.includes('indent') && styles.indent,
            className?.input
          )}
        />
        <div className={cls(styles.icon, className?.icon)} onClick={onIconClick}>
          {icon}
        </div>
      </div>
      {error && <span className={cls(styles.error, className?.error)}>{error}</span>}
    </div>
  );
};

export { DatePickerRow };
