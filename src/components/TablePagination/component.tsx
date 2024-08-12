import Select from 'react-select';

import { ArrowButton } from '../../components/Buttons/ArrowButton';

import styles from './component.module.scss';
import { CSSProperties } from 'react';

const PageSizeSelectorStyles: Record<string, (styles: CSSProperties) => CSSProperties> = {
  indicatorSeparator: (styles) => ({ ...styles, display: 'none' }),
  valueContainer: (styles) => ({ ...styles, svg: { fill: 'black' } }),
  indicatorsContainer: (styles) => ({ ...styles, svg: { fill: 'black' } }),
  container: (styles) => ({ ...styles, borderRadius: '24px' }),
  control: (styles) => ({ ...styles, borderRadius: '24px' }),
};

export type ITablePaginationProps = {
  currentPage: number;
  totalPages: number | null;
  currentSize: number;
  pageSizes: number[];
  disabled?: boolean;
  useNextPageToken?: boolean;
  nextPageToken?: string;
  onPageSizeChange: (size: number) => void;
  onPageChange: (page: number) => void;
};

export const TablePagination = ({
  currentPage,
  totalPages,
  currentSize,
  pageSizes,
  disabled,
  useNextPageToken,
  nextPageToken,
  onPageSizeChange,
  onPageChange,
}: ITablePaginationProps) => {
  const options = pageSizes.map((size) => ({ value: size, label: size }));

  return (
    <div className={styles.main}>
      <div className={styles.selectContainer}>
        <span>Show</span>
        <Select
          styles={PageSizeSelectorStyles}
          options={options}
          defaultValue={options.find((opt) => opt.value === currentSize)}
          onChange={(option) => onPageSizeChange(option.value)}
        />
      </div>
      <div className={styles.arrows}>
        <ArrowButton
          handleClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0 || disabled}
        />
        <ArrowButton
          forward
          handleClick={() => onPageChange(Math.min((totalPages ?? Infinity) - 1, currentPage + 1))}
          disabled={currentPage === (totalPages ?? 0) - 1 || disabled || (useNextPageToken && !!nextPageToken)}
        />
      </div>
    </div>
  );
};
