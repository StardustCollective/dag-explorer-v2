import clsx from "clsx";
import { use } from "react";

import { isPromiseLike, withSuspense } from "@/utils";

import Brain2OutlineIcon from "@/assets/icons/brain-2-outline.svg";
import FileLockIcon from "@/assets/icons/file-lock.svg";

export type IValidatorTypeChipProps = {
  type?:
    | Promise<"metagraph" | "validator" | null | undefined>
    | "metagraph"
    | "validator"
    | null;
};

export const ValidatorTypeChip = withSuspense(
  function ValidatorTypeChip({
    type: typePromise = "validator",
  }: IValidatorTypeChipProps) {
    const type = isPromiseLike(typePromise) ? use(typePromise) : typePromise;

    return (
      <div
        className={clsx(
          "flex items-center px-2.5 gap-1 h-7 w-fit border rounded-5xl",
          "font-medium text-xs",
          type === "metagraph" &&
            "border-green-600 bg-green-600/5 text-green-600",
          type === "validator" &&
            "border-stgz-purple-700 bg-stgz-purple-700/5 text-stgz-purple-700"
        )}
      >
        {type === "metagraph" && (
          <Brain2OutlineIcon className="size-4 shrink-0" />
        )}
        {type === "metagraph" && "Metagraph"}
        {type === "validator" && <FileLockIcon className="size-4 shrink-0" />}
        {type === "validator" && "Validator"}
      </div>
    );
  },
  ({}) => (
    <div
      className={clsx(
        "flex items-center px-2.5 gap-1 h-7 w-fit border rounded-5xl",
        "font-medium text-xs",
        "border-stgz-purple-700 bg-stgz-purple-700/5 text-stgz-purple-700"
      )}
    >
      {<FileLockIcon className="size-4 shrink-0" />}
      {"Validator"}
    </div>
  )
);
