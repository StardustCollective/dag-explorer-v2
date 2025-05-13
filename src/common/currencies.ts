import { ConstellationEcosystemAPI } from "./apis";
import { KnownCoinIds } from "./consts";
import { DagBaseFactor } from "./consts/currencies";
import { HgtpNetwork } from "./consts/network";

import { ITokenPriceData, IAPIResponse } from "@/types";
import { decodeDecimal, encodeDecimal } from "@/utils";

export const getKnownUsdPrice = async (
  network: HgtpNetwork,
  currencyId?: string
) => {
  if (![HgtpNetwork.MAINNET, HgtpNetwork.MAINNET_1].includes(network)) {
    return null;
  }

  const response = await ConstellationEcosystemAPI.get<
    IAPIResponse<Record<string, ITokenPriceData>>
  >(`/coin-prices`, {
    params: {
      ids: Object.values(KnownCoinIds).join(","),
      vs_currencies: "usd",
      include_market_cap: true,
      include_24hr_vol: true,
      include_24hr_change: true,
      include_last_updated_at: true,
      token: "dagexplorer",
    },
  });

  return response.data.data[KnownCoinIds[currencyId ?? "native"]]?.usd ?? null;
};

export const datumToDag = (datum: IDecimal) =>
  encodeDecimal(decodeDecimal(datum).div(DagBaseFactor));

export const dagToDatum = (dag: IDecimal) =>
  encodeDecimal(decodeDecimal(dag).mul(DagBaseFactor));
