import clsx from "clsx";
import Link from "next/link";

import { CopyAction } from "@/components/CopyAction";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { SuspenseValue } from "@/components/SuspenseValue";
import { IAPIMetagraphNodeLayerInfo } from "@/types";
import { isPromiseLike } from "@/utils";

import EdgeNodeAltIcon from "@/assets/icons/edge-node-alt.svg";

export type INodeLayerInfoProps = {
  type: "l0" | "cl1" | "dl1";
  layerInfo?:
    | Promise<IAPIMetagraphNodeLayerInfo | null | undefined>
    | IAPIMetagraphNodeLayerInfo
    | null;
};

export const NodeLayerInfo = ({ type, layerInfo }: INodeLayerInfoProps) => {
  const _layerInfo = isPromiseLike(layerInfo)
    ? layerInfo
    : Promise.resolve(layerInfo);

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
            <EdgeNodeAltIcon className="size-6 black/65" />
            Validators
          </span>{" "}
          <span>
            {type === "l0" && "L0"}
            {type === "cl1" && "cL1"}
            {type === "dl1" && "dL1"}
          </span>
        </div>
        <span className="text-hgtp-blue-600 font-semibold text-4.5xl">
          <SuspenseValue
            value={_layerInfo.then((info) => info?.nodes ?? 0)}
            fallback={<SkeletonSpan className="w-16" />}
          />
        </span>
      </div>
      <SuspenseValue
        className="flex items-center justify-center gap-2 w-full"
        value={_layerInfo.then((info) =>
          info?.url ? (
            <>
              <Link href={info.url} className="overflow-hidden text-ellipsis whitespace-nowrap max-w-full block">
                {info.url}
              </Link>{" "}
              <CopyAction value={info.url} />
            </>
          ) : (
            ""
          )
        )}
        fallback={<SkeletonSpan className="w-16" />}
      />
    </div>
  );
};
