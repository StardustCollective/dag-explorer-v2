import { COIN_IDS } from '../constants';
import { useFetch } from '../utils/reactQuery';
const { REACT_APP_ECOSYSTEM_API_URL } = process.env;

export const useGetPrices = () => {
  const coinIds = Object.values(COIN_IDS).join(',');
  const params = {
    ids: coinIds,
    vs_currencies: 'usd',
    include_market_cap: 'true',
    include_24hr_vol: 'true',
    include_24hr_change: 'true',
    include_last_updated_at: 'true',
    token: 'dagExplorer',
  };
  return useFetch(REACT_APP_ECOSYSTEM_API_URL + '/coin-prices', params, {
    refetchInterval: 30000,
  });
};
