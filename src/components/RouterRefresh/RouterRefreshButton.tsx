"use client";

import { useRouter } from "next/navigation";
import { useErrorBoundary } from "react-error-boundary";

export type IRouterRefreshButtonProps = React.JSX.IntrinsicElements["button"];

export const RouterRefreshButton = (props: IRouterRefreshButtonProps) => {
  const router = useRouter();
  const {resetBoundary} = useErrorBoundary();

  return (
    <button
      {...props}
      onClick={() => {
        router.refresh();
        resetBoundary();
      }}
    />
  );
};
