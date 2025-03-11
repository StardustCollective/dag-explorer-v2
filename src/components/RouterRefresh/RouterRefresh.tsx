"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export type IRouterRefreshProps = { interval: number };

export const RouterRefresh = ({ interval }: IRouterRefreshProps) => {
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      router.refresh();
    }, interval);
    return () => clearInterval(intervalId);
  }, [interval, router]);

  return null;
};
