import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import Decimal from 'decimal.js';
import millify from 'millify';

dayjs.extend(relativeTime);
dayjs.extend(utc);

export enum NumberFormat {
  MILLIFY,
  WHOLE,
  DECIMALS,
  DECIMALS_TRIMMED,
  DECIMALS_TRIMMED_EXPAND,
  MILLIFY_WHOLE,
  MILLIFY_EXPANDED,
}

const formater = new Intl.NumberFormat('en-US', { maximumFractionDigits: 8 });

export const formatDagPrice = (dagInfo, btcInfo) => {
  const rounded = Math.round((dagInfo.usd + Number.EPSILON) * 100) / 100;
  const btcEquiv = (dagInfo.usd / btcInfo.usd).toFixed(8);
  return '$' + rounded + ' USD - ' + btcEquiv + ' BTC';
};

export const formatMarketVol = (formater, dagInfo) => '24h Trading Vol: $' + formater.format(dagInfo.usd_24h_vol);

export const formatPrice = (amount: number, dagInfo: any, toFixed: number) => {
  const formatedValue = (amount / Math.pow(10, 8)).toFixed(8);
  return formater.format(parseFloat((parseFloat(formatedValue) * dagInfo.usd).toFixed(toFixed)));
};

export const formatPriceWithSymbol = (
  amount: number,
  dagInfo: any,
  toFixed: number,
  prefixSymbol: string,
  suffixSymbol: string
) => {
  return `${prefixSymbol || ''}${formatPrice(amount, dagInfo, toFixed)} ${suffixSymbol || ''}`;
};

export const formatAmount = (amount: number, toFixed: number, forExport?: boolean, suffix = 'DAG', isFee=false) => {
  const formatedValue = (amount / Math.pow(10, 8)).toFixed(toFixed);
  const regex = formatedValue.match('^(\\d+\\.\\d*?)(0+)$');
  let toReturn: string;
  if (regex) {
    const subString = regex[1].split('.')[1];
    if (subString && subString.length >= 2) {
      return forExport ? regex[1] : formater.format(parseFloat(regex[1])) + ' ' + suffix;
    } else {
      toReturn = subString.length === 1 ? regex[1].concat('0') : regex[1].concat('00');
    }
  }
  return forExport
    ? toReturn
      ? toReturn
      : formater.format(parseFloat(formatedValue))
    : (toReturn ? formater.format(parseFloat(toReturn)) : formater.format(parseFloat(formatedValue))) + ' ' + suffix;
};

export const fitStringInCell = (value: string, size: number = null, ignoreSuffix = false) =>
  value.slice(0, size ?? 5) + '...' + (ignoreSuffix ? '' : value.slice(value.length - (size ?? 5)));

export const formatTotalSupply = () => 'Max Supply: 3,693,588,685';

const formatRelativeString = (date: string) => {
  let formatedDate = date;
  if (date.indexOf('minutes') !== -1) {
    formatedDate = date.replace('minutes', 'mins');
  }
  if (date.indexOf('seconds') !== -1) {
    formatedDate = date.replace('seconds', 'secs');
  }
  return formatedDate;
};

export const formatTime = (timestamp: string | number, format: 'full' | 'relative' | 'date') => {
  return format === 'full'
    ? dayjs(timestamp).utc().toISOString()
    : format === 'date'
    ? dayjs(timestamp).utc().format('YYYY-MM-DD')
    : formatRelativeString(dayjs().to(dayjs(timestamp)));
};

export const formatNumber = (number: number | Decimal | string | undefined | null, format: NumberFormat): string => {
  if (number === '' || number === undefined || number === null || isNaN(<number>number)) {
    return '';
  }

  if (number instanceof Decimal) {
    number = number.toNumber();
  }

  if (format === NumberFormat.MILLIFY) {
    return millify(<number>number);
  }

  if (format === NumberFormat.WHOLE) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(<number>number);
  }

  if (format === NumberFormat.DECIMALS) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(<number>number);
  }

  if (format === NumberFormat.DECIMALS_TRIMMED) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(<number>number);
  }

  if (format === NumberFormat.DECIMALS_TRIMMED_EXPAND) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
    }).format(<number>number);
  }

  if (format === NumberFormat.MILLIFY_WHOLE) {
    return millify(<number>number, { precision: 0 });
  }

  if (format === NumberFormat.MILLIFY_EXPANDED) {
    const exponent = Math.floor(Math.log10(<number>number));
    const precision = Math.min(Math.max(Math.floor(exponent / 3 /* 3 Zeros */) - 1, 0), 3);
    return millify(<number>number, { precision });
  }

  return '--';
};
