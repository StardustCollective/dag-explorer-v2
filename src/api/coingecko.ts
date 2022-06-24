import { COIN_IDS } from '../constants';
import { useFetch } from '../utils/reactQuery';
const { REACT_APP_COINGECKO_URL } = process.env;

export const useGetPrices = () => {
  const coinIds = Object.values(COIN_IDS).join(',');
  const params = {
    ids: coinIds,
    vs_currencies: 'usd',
    include_market_cap: 'true',
    include_24hr_vol: 'true',
    include_24hr_change: 'true',
    include_last_updated_at: 'true',
  };
  return useFetch(REACT_APP_COINGECKO_URL + '/simple/price', params, {
    refetchInterval: 10000,
    cacheTime: 0,
  });
};
