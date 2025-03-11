"use client";

import { useRouter } from "next/navigation";

export type IRouterRefreshButtonProps = React.JSX.IntrinsicElements["button"];

export const RouterRefreshButton = (props: IRouterRefreshButtonProps) => {
  const router = useRouter();

  return <button {...props} onClick={() => router.refresh()} />;
};
