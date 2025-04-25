import { StargazerEIPProvider } from "@stardust-collective/web3-react-stargazer-connector";
import { valid } from "semver";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";

import { StargazerNetworkIds } from "./consts";

import { HgtpNetwork } from "@/common/consts";

type IErrorListener = (error: Error) => void;

export class WalletProviderError extends Error {
  constructor(message: string) {
    super("Stargazer Connection: " + message);
  }
}

export type IWalletState = {
  status: "connected" | "initializing" | "disconnected";
  address: string | null;
  network: HgtpNetwork | null;
  provider: StargazerEIPProvider | null;
  version: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  addErrorListener: (listener: IErrorListener) => void;
  removeErrorListener: (listener: IErrorListener) => void;
};

export const createWalletStore = () =>
  createStore<IWalletState>()(
    immer((set, get) => {
      const errorListeners = new Set<IErrorListener>();

      const handleError = (error: Error): never => {
        errorListeners.forEach((listener) => listener(error));
        throw error;
      };

      const resetState = () => {
        set((state) => {
          state.status = "disconnected";
          state.address = null;
          state.network = null;
          state.provider = null;
          state.version = null;
        });
      };

      const addEventListeners = (provider: StargazerEIPProvider) => {
        provider.on("chainChanged", handleChainUpdate);
        provider.on("accountsChanged", handleAccountsUpdate);
        provider.on("disconnect", handleWalletDisconnect);
      };

      const removeEventListeners = (provider: StargazerEIPProvider) => {
        provider.removeListener("chainChanged", handleChainUpdate);
        provider.removeListener("accountsChanged", handleAccountsUpdate);
        provider.removeListener("disconnect", handleWalletDisconnect);
      };

      const connectInternal = (
        provider: StargazerEIPProvider,
        version: string
      ) => {
        addEventListeners(provider);

        set((state) => {
          state.status = "connected";
          state.provider = provider;
          state.version = version;
        });
      };

      const disconnectInternal = () => {
        const provider = get().provider;

        if (provider) {
          removeEventListeners(provider);
        }

        resetState();
      };

      const handleChainUpdate = (chainId: string | number) => {
        const network = (
          Object.entries(StargazerNetworkIds) as [HgtpNetwork, string][]
        ).find(([, id]) => id === String(chainId))?.[0];

        if (!network) {
          disconnectInternal();
          throw handleError(
            new WalletProviderError(
              "Unknown network, please make sure you are connected to a valid network"
            )
          );
        }

        set((state) => {
          state.network = network;
        });
      };

      const handleAccountsUpdate = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectInternal();
          throw handleError(
            new WalletProviderError(
              "No accounts found, make sure you authorize this dapp to access your wallet"
            )
          );
        }

        set((state) => {
          state.address = accounts[0];
        });
      };

      const handleWalletDisconnect = () => {
        disconnectInternal();
      };

      const connect = async () => {
        set((state) => {
          state.status = "initializing";
        });

        if (!window.stargazer) {
          throw handleError(
            new WalletProviderError(
              "Unable to detect stargazer, are you sure it's installed?"
            )
          );
        }

        if (!("version" in window.stargazer)) {
          throw handleError(
            new WalletProviderError("Unsupported stargazer version")
          );
        }

        const version = String(window.stargazer.version);

        if (!valid(version)) {
          throw handleError(
            new WalletProviderError("Invalid stargazer version")
          );
        }

        const provider = window.stargazer.getProvider("constellation");

        try {
          await provider.activate();

          const chainId: string | number = await provider.request({
            method: "dag_chainId",
          });

          const dagAccounts: string[] = await provider.request({
            method: "dag_accounts",
          });

          connectInternal(provider, version);

          handleChainUpdate(chainId);
          handleAccountsUpdate(dagAccounts);
        } catch (e) {
          disconnectInternal();
          throw handleError(
            e instanceof Error ? e : new WalletProviderError(String(e))
          );
        }
      };

      const disconnect = async () => {
        disconnectInternal();
      };

      const addErrorListener = (listener: IErrorListener) => {
        errorListeners.add(listener);
      };

      const removeErrorListener = (listener: IErrorListener) => {
        errorListeners.delete(listener);
      };

      return {
        status: "disconnected",
        address: null,
        network: null,
        provider: null,
        version: null,
        connect,
        disconnect,
        addErrorListener,
        removeErrorListener,
      };
    })
  );
