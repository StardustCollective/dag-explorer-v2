"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export type IAutoRefreshProps = { interval: number };

export const AutoRefresh = ({ interval }: IAutoRefreshProps) => {
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      router.refresh();
    }, interval);
    return () => clearInterval(intervalId);
  }, [interval, router]);

  return null;
};
