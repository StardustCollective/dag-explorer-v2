"use client";
// import ChevronLeftIcon from "@/assets/icons/chevron_left.svg";
// import ChevronRightIcon from "@/assets/icons/chevron_right.svg";
import clsx from "clsx";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { useClientPagination } from "@/hooks";

const PaginationNumber = ({
  content,
  selected,
  disabled,
  onClick,
}: {
  content: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  return (
    <span
      className={clsx(
        "flex justify-center items-center size-8",
        selected && "border rounded-xs border-frame-2083",
        disabled && "opacity-40",
        !disabled && "cursor-pointer"
      )}
      onClick={!disabled ? onClick : undefined}
    >
      {content}
    </span>
  );
};

export type ITablePaginationProps = {
  total: number;
};

export const TablePagination = ({ total }: ITablePaginationProps) => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pagination = useClientPagination({
    total,
    page: useClientPagination.parseQueryPageInContext("p"),
    onPageChange: (page) =>
      replace(
        useClientPagination.replaceToPageInContext(
          page,
          "p",
          pathname,
          searchParams
        )
      ),
  });

  return (
    <div className="flex flex-row w-full h-16 items-center justify-between px-6">
      <span>
        Showing {pagination.offset + 1} to{" "}
        {pagination.offset + pagination.limit} {!total && <>records</>}
        {total && <>of {total} results</>}
      </span>
      <div className="flex flex-row gap-4">
        <PaginationNumber
          // content={<ChevronLeftIcon />}
          content={'<'}
          disabled={pagination.page === 0}
          onClick={() => pagination.goPrevPage()}
        />
        {new Array(3)
          .fill(null)
          .map(
            (_, idx) =>
              idx < (pagination.totalPages ?? 0) && (
                <PaginationNumber
                  key={idx}
                  content={idx + 1}
                  selected={idx === pagination.page}
                  onClick={() => pagination.goPage(idx)}
                />
              )
          )}
        {pagination.totalPages > 3 && <PaginationNumber content="..." />}
        {new Array(3)
          .fill(null)
          .map(
            (_, idx) =>
              pagination.totalPages - idx - 1 >= 3 && (
                <PaginationNumber
                  key={idx}
                  content={pagination.totalPages - idx}
                  selected={pagination.totalPages - idx - 1 === pagination.page}
                  onClick={() =>
                    pagination.goPage(pagination.totalPages - idx - 1)
                  }
                />
              )
          )
          .reverse()}
        <PaginationNumber
          // content={<ChevronRightIcon />}
          content={'>'}
          disabled={pagination.page === pagination.totalPages - 1}
          onClick={() => pagination.goNextPage()}
        />
      </div>
    </div>
  );
};
