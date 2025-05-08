import clsx from "clsx";
import React from "react";

export type ITextInputProps = Omit<
  React.JSX.IntrinsicElements["input"],
  "title" | "caption" | "valueChildren" | "error"
> & {
  title?: React.ReactNode;
  caption?: React.ReactNode;
  valueChildren?: React.ReactNode;
  error?: boolean;
};

export const TextInput = ({
  title,
  caption,
  valueChildren,
  error,
  onClick,
  value,
  ...props
}: ITextInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1 text-gray-600 font-semibold text-xs">
        {title}
      </div>
      <div
        className={clsx(
          "flex w-full gap-2 px-4 py-3 bg-cfff/50 border-[1.5px] border-cef6 rounded-lg",
          error && "border-red-500 text-red-500 bg-red-50/50"
        )}
        onClick={onClick}
      >
        <input
          {...props}
          value={value ?? ""}
          className={clsx(
            "flex w-0 grow",
            "font-medium bg-transparent outline-hidden border-none",
            error && "text-red-500",
            props.className
          )}
        />
        {valueChildren && (
          <div className="flex items-center gap-2">{valueChildren}</div>
        )}
      </div>
      {caption && (
        <span className="flex flex-row flex-nowrap items-center gap-1.5 text-xs">
          {caption}
        </span>
      )}
    </div>
  );
};
