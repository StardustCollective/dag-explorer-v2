import clsx from "clsx";
import Link from "next/link";
import { use } from "react";

import { CopyAction } from "@/components/CopyAction";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { IAPIMetagraphNodeLayerInfo } from "@/types";
import { isPromiseLike, withSuspense } from "@/utils";

import EdgeNodeAltIcon from "@/assets/icons/edge-node-alt.svg";

export type INodeLayerInfoProps = {
  type: "l0" | "cl1" | "dl1";
  layerInfo?:
    | Promise<IAPIMetagraphNodeLayerInfo | null | undefined>
    | IAPIMetagraphNodeLayerInfo
    | null;
};

export const NodeLayerInfo = withSuspense(
  function NodeLayerInfo({
    type,
    layerInfo: layerInfoPromise,
  }: INodeLayerInfoProps) {
    const layerInfo = isPromiseLike(layerInfoPromise)
      ? use(layerInfoPromise)
      : layerInfoPromise;

    return (
      <div className="card flex flex-col gap-6 p-5">
        <div className="flex flex-col gap-4 items-center">
          <div
            className={clsx(
              "flex items-center justify-between w-full",
              "font-semibold"
            )}
          >
            <span className="flex items-center gap-2">
              <EdgeNodeAltIcon className="size-6 black/65 shrink-0" />
              Validators
            </span>{" "}
            <span>
              {type === "l0" && "L0"}
              {type === "cl1" && "cL1"}
              {type === "dl1" && "dL1"}
            </span>
          </div>
          <span className="text-hgtp-blue-600 font-semibold text-4.5xl">
            {layerInfo?.nodes ?? 0}
          </span>
        </div>
        <span className="flex items-center justify-center gap-2 w-full">
          {layerInfo?.url ? (
            <>
              <Link
                href={layerInfo.url}
                className="overflow-hidden text-ellipsis whitespace-nowrap max-w-full block"
              >
                {layerInfo.url}
              </Link>{" "}
              <CopyAction value={layerInfo.url} />
            </>
          ) : (
            ""
          )}
        </span>
      </div>
    );
  },
  ({ type }) => (
    <div className="card flex flex-col gap-6 p-5">
      <div className="flex flex-col gap-4 items-center">
        <div
          className={clsx(
            "flex items-center justify-between w-full",
            "font-semibold"
          )}
        >
          <span className="flex items-center gap-2">
            <EdgeNodeAltIcon className="size-6 black/65 shrink-0" />
            Validators
          </span>{" "}
          <span>
            {type === "l0" && "L0"}
            {type === "cl1" && "cL1"}
            {type === "dl1" && "dL1"}
          </span>
        </div>
        <span className="text-hgtp-blue-600 font-semibold text-4.5xl">
          <SkeletonSpan className="w-16" />
        </span>
      </div>
      <span className="flex items-center justify-center gap-2 w-full">
        <SkeletonSpan className="w-16" />
      </span>
    </div>
  )
);
