"use client";
import { dag4 } from "@stardust-collective/dag4";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { NetworksOnly } from "../NetworksOnly";
import { PageLayout } from "../PageLayout";
import { SearchBar } from "../SearchBar";

import { HgtpNetwork } from "@/common/consts";
import { isDecNumber, isHexNumber, stringFormat } from "@/utils";

export type INetworkHeaderProps = {
  network: HgtpNetwork;
};

export const NetworkHeader = ({ network }: INetworkHeaderProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const onSearch = () => {
    const _search = search.trim();

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

    if (isDecNumber(_search)) {
      router.push(`/snapshots/${_search}`);
      setSearch("");
      return;
    }

    router.push(`/search/${_search}`);
  };

  return (
    <PageLayout
      className={{
        wrapper: "bg-c2fc border-b border-gray-300",
        children: "flex justify-between items-end px-20 py-7.5",
      }}
    >
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-xs text-gray-600 uppercase">
          Constellation Network
        </span>
        <NetworksOnly network={network} exceptOn={[HgtpNetwork.MAINNET_1]}>
          <span className="font-semibold text-4.5xl text-hgtp-blue-600">
            {stringFormat(network, "TITLE_CASE")}
          </span>
        </NetworksOnly>
        <NetworksOnly network={network} onlyOn={[HgtpNetwork.MAINNET_1]}>
          <span className="font-semibold text-4.5xl text-hgtp-blue-600">
            Mainnet (Old)
          </span>
        </NetworksOnly>
      </div>
      <SearchBar
        className="w-[629px]"
        placeholder="Search by address, transaction hash..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onSearch={onSearch}
      />
    </PageLayout>
  );
};
