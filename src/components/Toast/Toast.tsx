"use client";

import clsx from "clsx";
import { toast as sonnerToast, ExternalToast } from "sonner";

import CircleCheckIcon from "@/assets/icons/circle-check-outline.svg";
import CircleXIcon from "@/assets/icons/circle-x.svg";

export type IToastProps = {
  id?: string | number;
  type?: "success" | "failure";
  content?: React.ReactNode;
};

export const Toast = ({ type = "success", content }: IToastProps) => {
  return (
    <div
      className={clsx(
        "card flex gap-2 justify-center items-center p-4",
        type === "success" && "border-green-600 bg-green-50 text-green-800",
        type === "failure" && "border-red-600 bg-red-50 text-red-800",
        "w-full max-w-[280px]",
        "text-xs"
      )}
    >
      {type === "success" && (
        <CircleCheckIcon className={clsx("size-5 shrink-0")} />
      )}
      {type === "failure" && (
        <CircleXIcon className={clsx("size-5 shrink-0")} />
      )}
      <span>{content}</span>
    </div>
  );
};

export const doToast = (
  content: IToastProps["content"],
  type: IToastProps["type"] = "success",
  options: ExternalToast
) => {
  return sonnerToast.custom(
    (id) => <Toast id={id} type={type} content={content} />,
    {
      duration: 3000,
      ...options,
    }
  );
};

export const doCloseToast = (id: IToastProps["id"]) => {
  sonnerToast.dismiss(id);
};
