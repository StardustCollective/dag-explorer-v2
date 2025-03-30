import clsx from "clsx";
import Image from "next/image";

import { SuspenseValue } from "../SuspenseValue";

import { isPromiseLike } from "@/utils";

export type IRoundedIconProps = {
  iconUrl?: Promise<string | null | undefined> | string | null;
  fallback?: React.ReactNode;
  size?: number;
  className?: string;
};

export const RoundedIcon = ({
  iconUrl,
  fallback,
  className,
  size = 10,
}: IRoundedIconProps) => {
  return (
    <SuspenseValue
      as="div"
      className={clsx(
        "border border-gray-300 rounded-full",
        `size-${size}`,
        className
      )}
      value={
        iconUrl
          ? (isPromiseLike(iconUrl) ? iconUrl : Promise.resolve(iconUrl)).then(
              (iconUrl) =>
                iconUrl ? (
                  <Image
                    src={iconUrl}
                    className="object-contain"
                    alt="rounded-icon"
                    width={size * 4}
                    height={size * 4}
                  />
                ) : (
                  fallback
                )
            )
          : fallback
      }
      fallback={fallback}
    />
  );
};
