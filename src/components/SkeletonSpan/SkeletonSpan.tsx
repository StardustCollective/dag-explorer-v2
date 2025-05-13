import clsx from "clsx";
import React from "react";

export type ISkeletonSpanProps = {
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const SkeletonSpanBase = ({
  loading=true,
  className,
  children,
}: ISkeletonSpanProps) => {
  if (!loading) {
    return children;
  }

  return (
    <span
      className={clsx(
        "inline-flex h-4 rounded-xs animate-pulse bg-gray-300",
        !className?.includes("w-") && "w-full",
        className
      )}
    ></span>
  );
};

export const SkeletonSpan = Object.assign(SkeletonSpanBase, {
  generateTableRecords: <K extends string>(
    size: number,
    keys: K[]
  ): Record<K, React.ReactNode>[] => {
    return new Array(size).fill(null).map((_, idx) => {
      const record = {} as Record<K, React.ReactNode>;

      for (const key of keys) {
        record[key] = <SkeletonSpanBase key={idx} className="w-8 lg:w-full" />;
      }

      return record;
    });
  },
  generateEmptyTableRecords: <K extends string>(
    size: number,
    keys: K[],
    filler = ""
  ): Record<K, React.ReactNode>[] => {
    return new Array(size).fill(null).map(() => {
      const record = {} as Record<K, React.ReactNode>;

      for (const key of keys) {
        record[key] = filler;
      }

      return record;
    });
  },
  displayName: "SkeletonSpan",
});
