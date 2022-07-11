import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

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

export const formatAmount = (amount: number, toFixed: number, forExport?: boolean) => {
  const formatedValue = (amount / Math.pow(10, 8)).toFixed(toFixed);
  const regex = formatedValue.match('^(\\d+\\.\\d*?)(0+)$');
  let toReturn: string;
  if (regex) {
    const subString = regex[1].split('.')[1];
    if (subString && subString.length >= 2) {
      return forExport ? regex[1] : formater.format(parseFloat(regex[1])) + ' DAG';
    } else {
      toReturn = subString.length === 1 ? regex[1].concat('0') : regex[1].concat('00');
    }
  }
  return forExport
    ? toReturn
      ? toReturn
      : formater.format(parseFloat(formatedValue))
    : (toReturn ? formater.format(parseFloat(toReturn)) : formater.format(parseFloat(formatedValue))) + ' DAG';
};

export const fitStringInCell = (value: string) => value.slice(0, 5) + '...' + value.slice(value.length - 5);

export const formatTotalSupply = () => 'Total Supply: 3,550,000,000';

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

export const formatTime = (timestamp: string, format: 'full' | 'relative') => {
  return format === 'full'
    ? dayjs(timestamp).format('MMM D, YYYY h:mm A Z')
    : formatRelativeString(dayjs().to(dayjs(timestamp)));
};
