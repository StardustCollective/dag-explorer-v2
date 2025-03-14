"use client";
import clsx from "clsx";
import { useState } from "react";

import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import MagnifyingGlass2Icon from "@/assets/icons/magnifying-glass-2.svg";

export type ISearchBarProps = Omit<
  React.JSX.IntrinsicElements["input"],
  "className"
> & {
  className?: string | { wrapper?: string; input?: string };
};

export const SearchBar = ({
  className,
  ref,
  onFocus,
  onBlur,
  ...props
}: ISearchBarProps) => {
  const [focus, setFocus] = useState(false);
  className =
    typeof className === "object" ? className : { wrapper: className };

  return (
    <div
      className={clsx(
        "flex py-2.5 px-4 bg-white border rounded-5xl items-center",
        !focus && "border-gray-300",
        focus && "border-hgtp-blue-600",
        className.wrapper
      )}
    >
      <div className="flex gap-3 grow">
        <MagnifyingGlass2Icon className="size-6" />
        <input
          className={clsx(
            "h-fit outline-none border-none grow placeholder:text-gray-600 text-cd14",
            className.input
          )}
          onFocus={(e) => {
            setFocus(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocus(false);
            onBlur?.(e);
          }}
          ref={ref}
          {...props}
        />
      </div>
      <div
        className={clsx(
          "flex justify-center items-center size-8 bg-hgtp-blue-600 border border-white/25 rounded-full",
          !focus && "opacity-50"
        )}
      >
        <span className="text-white text-center align-middle">
          <ArrowRightIcon className="size-6" />
        </span>
      </div>
    </div>
  );
};
