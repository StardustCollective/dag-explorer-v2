"use client";

import { dag4 } from "@stardust-collective/dag4";
import { useQuery } from "@tanstack/react-query";
import Decimal from "decimal.js";
import { createContext, useContext, useRef, useState } from "react";

import { ValidatorStakingCard } from "@/components/ValidatorStakingCard";
import { useClickOutside } from "@/hooks";
import { useNetworkContext } from "@/providers/NetworkProvider";
import { useWalletProvider } from "@/providers/WalletProvider";
import { getAddressBalance, getAddressStakingDelegations } from "@/queries";
import { formatCurrencyWithDecimals, shortenString } from "@/utils";

type IStakingActionsContext = {
  stakingOpen: boolean;
  userDelegatedAmounts?: Record<string, IDecimal>;
  requestStaking: (nodeId: string, commission: number) => void;
};

const StakingActionsContext = createContext<IStakingActionsContext | null>(
  null
);

export const StakingActionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { wallet } = useWalletProvider();
  const network = useNetworkContext();

  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setStakingOpen(false));

  const addressBalance = useQuery({
    queryKey: ["address-balance", wallet.active && wallet.account],
    queryFn: () =>
      getAddressBalance(network, (wallet.active && wallet.account) || ""),
    enabled: wallet.active,
  });

  const addressStakingDelegations = useQuery({
    queryKey: ["address-staking-delegations", wallet.active && wallet.account],
    queryFn: () =>
      getAddressStakingDelegations(
        network,
        (wallet.active && wallet.account) || ""
      ),
    enabled: wallet.active,
  });

  const [stakingOpen, setStakingOpen] = useState(false);
  const [stakingAmount, setStakingAmount] = useState<IDecimal>(new Decimal(0));
  const [stakingNodeId, setStakingNodeId] = useState<string | null>(null);
  const [stakingCommission, setStakingCommission] = useState<number | null>(
    null
  );

  return (
    <StakingActionsContext.Provider
      value={{
        stakingOpen,
        userDelegatedAmounts: addressStakingDelegations.data
          ?.filter((d) => d.withdrawalStartEpoch === null)
          .reduce((pv, cv) => {
            pv[cv.nodeId] = new Decimal(cv.amount);
            return pv;
          }, {} as Record<string, IDecimal>),
        requestStaking: (nodeId, commission) => {
          setStakingOpen(true);
          setStakingNodeId(nodeId);
          setStakingCommission(commission);
        },
      }}
    >
      {children}
      {stakingOpen && (
        <div className="modal">
          <ValidatorStakingCard
            ref={ref}
            walletBalanceInDAG={new Decimal(addressBalance.data ?? 0).div(
              Decimal.pow(10, 8)
            )}
            validatorName={shortenString(
              dag4.keyStore.getDagAddressFromPublicKey(stakingNodeId ?? "")
            )}
            totalDelegated={formatCurrencyWithDecimals("DAG", 0)}
            estimatedApy="10%"
            validatorCommission={(stakingCommission ?? 0) + "%"}
            unstakingPeriod="21 days"
            statuses={{
              step1: "Pending",
              step2: "Pending",
            }}
            value={stakingAmount}
            onValueChange={setStakingAmount}
            onCancel={() => {
              setStakingOpen(false);
              setStakingNodeId(null);
              setStakingCommission(null);
            }}
            onStake={() => {}}
          />
        </div>
      )}
    </StakingActionsContext.Provider>
  );
};

export const useStakingActionsProvider = () => {
  const context = useContext(StakingActionsContext);

  if (!context) {
    throw new Error(
      "useStakingActionsProvider calls must be done under a <StakingActionsProvider/> component"
    );
  }

  return context;
};
