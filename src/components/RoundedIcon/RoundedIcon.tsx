import clsx from "clsx";
import Image from "next/image";
import { use } from "react";

import { isPromiseLike, withSuspense } from "@/utils";

export type IRoundedIconProps = {
  iconUrl?: Promise<string | null | undefined> | string | null;
  fallback?: React.ReactNode;
  size?: number;
  className?: string;
};

export const RoundedIcon = withSuspense(
  function RoundedIcon({
    iconUrl: iconUrlPromise,
    fallback,
    className,
    size = 10,
  }: IRoundedIconProps) {
    const iconUrl = isPromiseLike(iconUrlPromise)
      ? use(iconUrlPromise)
      : iconUrlPromise;

    return (
      <div
        className={clsx(
          "inline-flex items-center justify-center",
          "border rounded-full",
          !className?.includes("border-") && "border-gray-300",
          className
        )}
        style={{ width: size * 4, height: size * 4 }}
      >
        {iconUrl ? (
          <Image
            src={iconUrl}
            className="object-contain rounded-full"
            alt="rounded-icon"
            width={size * 4}
            height={size * 4}
          />
        ) : (
          fallback
        )}
      </div>
    );
  },
  ({ fallback, size = 10, className }) => (
    <div
      className={clsx(
        "inline-flex items-center justify-center",
        "border border-gray-300 rounded-full",
        className
      )}
      style={{ width: size * 4, height: size * 4 }}
    >
      {fallback}
    </div>
  )
);
