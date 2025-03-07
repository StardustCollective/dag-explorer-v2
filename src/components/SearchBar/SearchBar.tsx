"use client";
import clsx from "clsx";
import { useState } from "react";

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
        "flex py-3.5 px-4 bg-white border rounded-5xl",
        !focus && "border-gray-300",
        focus && "border-hgtp-blue-600",
        className.wrapper
      )}
    >
      <div className="flex gap-3 grow">
        <input
          className={clsx(
            "h-fit outline-none border-none grow placeholder:text-gray-600 text-cd14",
            className.input
          )}
          onFocus={(e) => {
            setFocus(true);
            onFocus && onFocus(e);
          }}
          onBlur={(e) => {
            setFocus(false);
            onBlur && onBlur(e);
          }}
          ref={ref}
          {...props}
        />
      </div>
      <div
        className={clsx(
          "flex justify-center items-center size-6 bg-hgtp-blue-600 rounded-full",
          !focus && "opacity-50"
        )}
      >
        <span className="text-white text-center align-middle">
          {"-"}
        </span>
      </div>
    </div>
  );
};
