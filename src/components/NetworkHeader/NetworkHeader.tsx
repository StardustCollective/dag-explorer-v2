"use client";
import { dag4 } from "@stardust-collective/dag4";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { NetworksOnly } from "../NetworksOnly";
import { PageLayout } from "../PageLayout";
import { SearchBar } from "../SearchBar";

import { HgtpNetwork } from "@/common/consts";
import { isDecNumber, isHexNumber, stringFormat } from "@/utils";

import TriangleExclamationIcon from "@/assets/icons/triangle-exclamation.svg";

export type INetworkHeaderProps = {
  network: HgtpNetwork;
};

export const NetworkHeader = ({ network }: INetworkHeaderProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const onSearch = () => {
    const _search = search.trim();

    if (_search === "") {
      return;
    }

    if (dag4.keyStore.validateDagAddress(_search)) {
      router.push(`/address/${_search}`);
      setSearch("");
      return;
    }

    if (isHexNumber(_search, 64)) {
      router.push(`/transactions/${_search}`);
      setSearch("");
      return;
    }

    if (isHexNumber(_search, 128)) {
      router.push(
        `/address/${dag4.keyStore.getDagAddressFromPublicKey(_search)}`
      );
      setSearch("");
      return;
    }

    if (isDecNumber(_search)) {
      router.push(`/snapshots/${_search}`);
      setSearch("");
      return;
    }

    router.push(`/search/${_search}`);
  };

  return (
    <>
      <NetworksOnly network={network} onlyOn={[HgtpNetwork.TESTNET]}>
        <PageLayout
          className={{
            wrapper: "bg-yellow-50 border-b border-yellow-500",
            children:
              "flex flex-col lg:flex-row justify-center items-center gap-2 py-3",
          }}
        >
          <TriangleExclamationIcon className="size-5 shrink-0 text-yellow-500" />
          <span className="font-medium text-sm text-center">
            Note: Constellation Testnet is an experimental environment and
            should be considered unstable.
          </span>
        </PageLayout>
      </NetworksOnly>
      <NetworksOnly network={network} onlyOn={[HgtpNetwork.MAINNET_1]}>
        <PageLayout
          className={{
            wrapper: "bg-yellow-50 border-b border-yellow-500",
            children:
              "flex flex-col lg:flex-row justify-center items-center gap-2 py-3",
          }}
        >
          <TriangleExclamationIcon className="size-5 shrink-0 text-yellow-500" />
          <span className="font-medium text-sm text-center">
            Attention: The Mainnet 1.0 network transitioned to Mainnet 2.0 on
            2022-09-28. Switch to Mainnet 2.0 to view current activity.
          </span>
        </PageLayout>
      </NetworksOnly>
      <PageLayout
        className={{
          wrapper: "bg-c2fc border-b border-gray-300",
          children:
            "flex flex-col lg:flex-row justify-between lg:items-end gap-8 px-4 lg:px-20 py-7.5",
        }}
      >
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-sm tracking-wide text-gray-600 uppercase">
            Constellation Network
          </span>
          <NetworksOnly network={network} exceptOn={[HgtpNetwork.MAINNET_1]}>
            <span className="font-semibold text-5xl tracking-tighter text-hgtp-blue-600">
              {stringFormat(network, "TITLE_CASE")}
            </span>
          </NetworksOnly>
          <NetworksOnly network={network} onlyOn={[HgtpNetwork.MAINNET_1]}>
            <span className="font-semibold text-5xl tracking-tighter text-hgtp-blue-600">
              Mainnet (Old)
            </span>
          </NetworksOnly>
        </div>
        <SearchBar
          className="w-[629px] hidden lg:flex"
          placeholder="Search by address, transaction hash..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={onSearch}
        />
        <SearchBar
          className="w-full lg:hidden"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={onSearch}
        />
      </PageLayout>
    </>
  );
};
