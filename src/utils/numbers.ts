const formater = new Intl.NumberFormat('en-US', { maximumFractionDigits: 8 });

export const formatDagPrice = (dagInfo, btcInfo) => {
  const rounded = Math.round((dagInfo.usd + Number.EPSILON) * 100) / 100;
  const btcEquiv = (dagInfo.usd / btcInfo.usd).toFixed(8);
  return '$' + rounded + ' USD - ' + btcEquiv + ' BTC';
};

export const formatMarketVol = (formater, dagInfo) => '24h Trading Vol: $' + formater.format(dagInfo.usd_24h_vol);

export const formatTime = (date: Date) => {
  const actualDate = new Date();
  const diff = actualDate.getTime() - date.getTime();
  const secDiff = diff / 1000;
  const minDiff = diff / 60 / 1000;
  const hourDiff = diff / 3600 / 1000;
  const dayDiff = diff / 86400 / 1000;

  if (dayDiff > 1) {
    return Math.floor(dayDiff) + ' days ago';
  }

  if (hourDiff > 1) {
    return Math.floor(hourDiff) + ' hs ago';
  }

  if (minDiff < 60 && minDiff > 1) {
    return Math.floor(minDiff) + ' mins ago';
  }

  return Math.floor(secDiff) + ' secs ago';
};

export const formatPrice = (amount: string, dagInfo: any, toFixed: number) => {
  return (parseFloat(amount) * dagInfo.usd).toFixed(toFixed);
};

export const formatAmount = (amount: number, toFixed: number) => {
  const formatedValue = (amount / Math.pow(10, 8)).toFixed(toFixed);
  const regex = formatedValue.match('^(\\d+\\.\\d*?)(0+)$');
  let toReturn: string;
  if (regex) {
    const subString = regex[1].split('.')[1];
    if (subString && subString.length >= 2) {
      return regex[1] + ' DAG';
    } else {
      toReturn = subString.length === 1 ? regex[1].concat('0') : regex[1].concat('00');
    }
  }
  return (toReturn ? toReturn : formater.format(parseFloat(formatedValue))) + ' DAG';
};

export const fitStringInCell = (value: string) => value.slice(0, 5) + '...' + value.slice(value.length - 5);
