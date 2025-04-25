"use client";
import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

import { MenuCard, MenuCardOption } from "../MenuCard";

import { buildSearchParams } from "@/utils";

import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg";

export type IPaginationProps = {
  pageSize?: number;
  pageSizes?: number[];
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  onPrevPage?: () => void;
  onNextPage?: () => void;
};

export const Pagination = ({
  pageSize,
  pageSizes = [10, 20, 50],
  hasPrevPage,
  hasNextPage,
  onPrevPage,
  onNextPage,
}: IPaginationProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const nextSearchParams = buildSearchParams(searchParams);

  const [openPageSize, setOpenPageSize] = useState(false);

  return (
    <div className="flex items-center justify-between w-full py-3.5 px-6">
      <div className={clsx("flex items-center gap-1", "text-sm text-gray-600")}>
        Show
        <div className="relative">
          <span
            className={clsx(
              "flex items-center gap-1 py-1 px-3",
              "border border-hgtp-blue-400 rounded-full",
              "text-hgtp-blue-900 font-medium text-xs",
              "cursor-pointer"
            )}
            onClick={() => setOpenPageSize(!openPageSize)}
          >
            {pageSize}
            {openPageSize ? (
              <ChevronUpIcon className="size-3.5 shrink-0" />
            ) : (
              <ChevronDownIcon className="size-3.5 shrink-0" />
            )}
          </span>
          {openPageSize && (
            <MenuCard
              variant="compact"
              className="absolute top-full left-0 mt-1.5 w-full z-10"
              onClickOutside={() => setOpenPageSize(false)}
            >
              {pageSizes?.map((size) => (
                <MenuCardOption
                  key={size}
                  renderAs="a"
                  href={`${pathname}?${nextSearchParams({
                    limit: String(size),
                  })}`}
                  variant="compact"
                  className="items-center justify-center"
                >
                  {size}
                </MenuCardOption>
              ))}
            </MenuCard>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          disabled={!hasPrevPage}
          onClick={onPrevPage}
          className={clsx(
            "flex items-center justify-center py-1.5 px-4",
            "border border-black/5 rounded-full",
            "bg-hgtp-blue-900/15",
            "text-hgtp-blue-900",
            !hasPrevPage && "opacity-40"
          )}
        >
          <ArrowLeftIcon className="size-4 shrink-0" />
        </button>
        <button
          disabled={!hasNextPage}
          onClick={onNextPage}
          className={clsx(
            "flex items-center justify-center py-1.5 px-4",
            "border border-black/5 rounded-full",
            "bg-hgtp-blue-900/15",
            "text-hgtp-blue-900",
            !hasNextPage && "opacity-40"
          )}
        >
          <ArrowRightIcon className="size-4 shrink-0" />
        </button>
      </div>
    </div>
  );
};
