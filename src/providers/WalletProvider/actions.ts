import { gte } from "semver";

import { DelegatedStakingMinVersion } from "./consts";
import { useWalletStore } from "./provider";

import { HgtpNetwork } from "@/common/consts";
import { withErrorToast } from "@/components/Toast";

export const useWalletActions = (store: ReturnType<typeof useWalletStore>) => {
  const assertWalletVersion = (comparison: "gte", version: string) => {
    const wallet = store.getState();

    if (!wallet.version) {
      throw new Error("Wallet version is not available");
    }

    if (comparison === "gte" && !gte(wallet.version, version)) {
      throw new Error(
        `Invalid wallet version ${wallet.version}, delegating staking is` +
          ` available from version ${version}, please update to a newer ` +
          `version of the wallet`
      );
    }

    return;
  };

  const isWalletOnNetwork = withErrorToast(
    async (network: HgtpNetwork) => {
      const wallet = store.getState();
      return network === wallet.network;
    },
    (error) => `WalletError: ${error}`
  );

  const requestTokenLock = withErrorToast(
    async (
      amount: number,
      currencyId: string | null,
      unlockEpoch: number | null
    ) => {
      const wallet = store.getState();
      if (!wallet.provider) {
        throw new Error("Wallet is not active, cannot sign messages");
      }

      assertWalletVersion("gte", DelegatedStakingMinVersion);

      const hash = await wallet.provider.request({
        method: "dag_tokenLock",
        params: [{ source: wallet.address, amount, currencyId, unlockEpoch }],
      });

      return { hash };
    },
    (error) => `WalletError: ${error}`
  );

  const requestDelegatedStake = withErrorToast(
    async (amount: number, nodeId: string, tokenLockRef: string) => {
      const wallet = store.getState();
      if (!wallet.provider) {
        throw new Error("Wallet is not active, cannot sign messages");
      }

      assertWalletVersion("gte", DelegatedStakingMinVersion);

      const hash = await wallet.provider.request({
        method: "dag_delegatedStake",
        params: [{ source: wallet.address, nodeId, amount, tokenLockRef }],
      });

      return { hash };
    },
    (error) => `WalletError: ${error}`
  );

  const requestWithdrawDelegatedStake = withErrorToast(
    async (delegatedStakeRef: string) => {
      const wallet = store.getState();
      if (!wallet.provider) {
        throw new Error("Wallet is not active, cannot sign messages");
      }

      assertWalletVersion("gte", DelegatedStakingMinVersion);

      const hash = await wallet.provider.request({
        method: "dag_withdrawDelegatedStake",
        params: [{ source: wallet.address, stakeRef: delegatedStakeRef }],
      });

      return { hash };
    },
    (error) => `WalletError: ${error}`
  );

  const requestSignMessage = withErrorToast(
    async (message: string) => {
      const wallet = store.getState();
      if (!wallet.provider) {
        throw new Error("Wallet is not active, cannot sign messages");
      }

      const signatureRequest = {
        content: message,
        metadata: {},
      };

      const signatureRequestEncoded = window.btoa(
        JSON.stringify(signatureRequest)
      );

      const signature = await wallet.provider.request({
        method: "dag_signMessage",
        params: [wallet.address, signatureRequestEncoded],
      });

      const pubKey = await wallet.provider.request({
        method: "dag_getPublicKey",
        params: [wallet.address],
      });

      return { signature, pubKey };
    },
    (error) => `WalletError: ${error}`
  );

  return {
    assertWalletVersion,
    isWalletOnNetwork,
    requestTokenLock,
    requestDelegatedStake,
    requestWithdrawDelegatedStake,
    requestSignMessage,
  };
};
