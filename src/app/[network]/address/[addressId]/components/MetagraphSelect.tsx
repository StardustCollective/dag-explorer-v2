"use client";

import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { HgtpNetwork } from "@/common/consts";
import { MenuCard, MenuCardOption } from "@/components/MenuCard";
import { MetagraphIcon } from "@/components/MetagraphIcon";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { SuspenseValue } from "@/components/SuspenseValue";
import { getMetagraphCurrencySymbol } from "@/queries";
import { IAPIAddressMetagraph } from "@/types";
import { buildSearchParams } from "@/utils";

import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg";

export type IMetagraphSelectProps = {
  address: string;
  network: HgtpNetwork;
  metagraphId?: string;
  metagraphs?: Promise<IAPIAddressMetagraph[]> | IAPIAddressMetagraph[];
  className?: string;
};

export const MetagraphSelect = ({
  address,
  network,
  metagraphId,
  metagraphs,
  className,
}: IMetagraphSelectProps) => {
  const [open, setOpen] = useState(false);
  const nextSearchParams = buildSearchParams(useSearchParams());

  const _metagraphs = useQuery({
    queryKey: ["metagraphs", address],
    queryFn: () => metagraphs,
  });

  return (
    <div className="relative">
      <div
        className={clsx(
          "flex items-center justify-between p-3 w-[200px]",
          "text-hgtp-blue-600",
          "border-[1.5px] border-hgtp-blue-600 rounded-5xl",
          className
        )}
        onClick={() => setOpen((s) => !s)}
      >
        <div className="flex items-center gap-2">
          <MetagraphIcon network={network} metagraphId={metagraphId} size={6} />
          <SuspenseValue
            value={getMetagraphCurrencySymbol(network, metagraphId)}
            fallback={<SkeletonSpan className="w-8" />}
          />
        </div>
        {open ? (
          <ChevronUpIcon className="size-5" />
        ) : (
          <ChevronDownIcon className="size-5" />
        )}
      </div>
      {open && (
        <MenuCard
          className="absolute top-full mt-2 w-[200px]"
          onClickOutside={() => setOpen(false)}
        >
          <MenuCardOption
            renderAs={"a"}
            href={`/address/${address}?${nextSearchParams({
              metagraphId: "",
            })}`}
          >
            <MetagraphIcon network={network} size={5} />
            DAG
          </MenuCardOption>
          {_metagraphs.data?.map((metagraph) => (
            <MenuCardOption
              key={metagraph.metagraphId}
              renderAs={"a"}
              href={`/address/${address}?${nextSearchParams({
                metagraphId: metagraph.metagraphId,
              })}`}
            >
              <MetagraphIcon
                network={network}
                iconUrl={metagraph.iconUrl}
                size={5}
              />
              {metagraph.symbol}
            </MenuCardOption>
          ))}
        </MenuCard>
      )}
    </div>
  );
};
