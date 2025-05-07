"use client";
import clsx from "clsx";
import Fuse from "fuse.js";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

import { ValidatorCard } from "./ValidatorCard";

import { EmptyState } from "@/components/EmptyState";
import { MenuCard, MenuCardOption } from "@/components/MenuCard";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { useDelegatedStakeProvider } from "@/features/delegated-stake/DelegatedStakeProvider";
import { buildSearchParams, stringFormat } from "@/utils";

import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg";
import Server1FilledIcon from "@/assets/icons/server-1-filled.svg";

export type IValidatorCardsProps = {
  limit?: number;
  filter?: "metagraphs" | "validators";
};

export const ValidatorCards = ({ limit, filter }: IValidatorCardsProps) => {
  const { validators } = useDelegatedStakeProvider();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextSearchParams = buildSearchParams(searchParams);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);

  const fuse = new Fuse(validators ?? [], {
    includeScore: true,
    threshold: 0.2,
    keys: ["nodeMetadataParameters.name", "nodeIdAddress", "peerId"],
  });

  let filteredValidators = search
    ? fuse.search(search).map((v) => v.item)
    : validators ?? [];

  filteredValidators =
    filter === "metagraphs"
      ? filteredValidators.filter((v) => v.metagraphNode)
      : filter === "validators"
      ? filteredValidators.filter((v) => !v.metagraphNode)
      : filteredValidators;

  if ((validators ?? []).length === 0) {
    return (
      <EmptyState
        variant="dark"
        label="No validators detected"
        renderIcon={Server1FilledIcon}
      />
    );
  }

  return (
    <>
      <div className="flex flex-wrap lg:grid lg:grid-cols-3 gap-6">
        <SearchBar
          className="w-full col-span-2 !py-2 !px-3, !bg-transparent hidden lg:flex"
          placeholder=" Search by node name or node ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
        <SearchBar
          className="w-full col-span-2 !py-2 !px-3, !bg-transparent lg:hidden"
          placeholder=" Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
        <div className="relative w-full">
          <button
            className={clsx(
              "card shadow-sm flex items-center justify-between",
              "w-full py-3 px-6",
              "rounded-full"
            )}
            onClick={() => setFilterOpen((s) => !s)}
          >
            <span>
              Filter by: {stringFormat(filter ?? "All nodes", "TITLE_CASE")}
            </span>
            {filterOpen ? (
              <ChevronUpIcon className="size-4 shrink-0" />
            ) : (
              <ChevronDownIcon className="size-4 shrink-0" />
            )}
          </button>
          {filterOpen && (
            <MenuCard
              className="absolute top-full left-0 mt-2.5 w-full z-10"
              onClickOutside={() => setFilterOpen(false)}
            >
              <MenuCardOption
                renderAs={Link}
                href={`${pathname}?${nextSearchParams({
                  filter: "",
                })}`}
                onClick={() => setFilterOpen(false)}
              >
                All nodes
              </MenuCardOption>
              <MenuCardOption
                renderAs={Link}
                href={`${pathname}?${nextSearchParams({
                  filter: "metagraphs",
                })}`}
                onClick={() => setFilterOpen(false)}
              >
                Metagraphs
              </MenuCardOption>
              <MenuCardOption
                renderAs={Link}
                href={`${pathname}?${nextSearchParams({
                  filter: "validators",
                })}`}
                onClick={() => setFilterOpen(false)}
              >
                Validators
              </MenuCardOption>
            </MenuCard>
          )}
        </div>
        {filteredValidators
          .slice(page * (limit ?? 15), (page + 1) * (limit ?? 15))
          .map((validator) => (
            <ValidatorCard
              key={validator.peerId}
              delegator={validator}
              delegatorMetagraph={validator.metagraphNode}
            />
          ))}
      </div>
      <Pagination
        pageSizes={[15, 30, 60]}
        pageSize={limit ?? 15}
        hasPrevPage={page > 0}
        hasNextPage={page < ((validators ?? []).length ?? 0) / (limit ?? 15)}
        onNextPage={() => {
          setPage(page + 1);
        }}
        onPrevPage={() => setPage(page - 1)}
      />
    </>
  );
};
