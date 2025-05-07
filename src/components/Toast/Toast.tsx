"use client";

import clsx from "clsx";
import { toast as sonnerToast, ExternalToast } from "sonner";

import CircleCheckIcon from "@/assets/icons/circle-check-outline.svg";
import CircleXIcon from "@/assets/icons/circle-x.svg";
import InformationIcon from "@/assets/icons/information.svg";

const ToastErrorProcessedSymbol = Symbol("ToastErrorProcessed");

const isToastErrorProcessed = (error: any): boolean => {
  return (
    typeof error === "object" &&
    error !== null &&
    ToastErrorProcessedSymbol in error &&
    error[ToastErrorProcessedSymbol] === true
  );
};

const tagToastErrorProcessed = (error: any): void => {
  if (typeof error === "object" && error !== null) {
    Object.assign(error, { [ToastErrorProcessedSymbol]: true });
  }
};

export type IToastProps = {
  id?: string | number;
  type?: "success" | "failure" | "info";
  content?: React.ReactNode;
};

export const Toast = ({ type = "success", content }: IToastProps) => {
  return (
    <div
      className={clsx(
        "card shadow-sm flex gap-2 justify-center items-center p-4",
        type === "success" && "border-green-600 bg-green-50 text-green-800",
        type === "failure" && "border-red-600 bg-red-50 text-red-800",
        type === "info" && "border-blue-600 bg-blue-50 text-blue-800",
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
      {type === "info" && (
        <InformationIcon className={clsx("size-5 shrink-0")} />
      )}
      <span>{content}</span>
    </div>
  );
};

export const doToast = (
  content: IToastProps["content"],
  type: IToastProps["type"] = "success",
  options?: ExternalToast
) => {
  return sonnerToast.custom(
    (id) => <Toast id={id} type={type} content={content} />,
    {
      duration: 6000,
      ...options,
    }
  );
};

export const doCloseToast = (id: IToastProps["id"]) => {
  sonnerToast.dismiss(id);
};

export const withErrorToast = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorMessage?: string | ((error: string) => string)
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      const result = await fn(...args);
      return result;
    } catch (error) {
      if (isToastErrorProcessed(error)) {
        throw error;
      }

      if (error instanceof Error) {
        doToast(
          typeof errorMessage === "function"
            ? errorMessage(error.message)
            : errorMessage ?? error.message,
          "failure",
          { duration: 15 * 1000 }
        );
      } else {
        doToast(
          typeof errorMessage === "function"
            ? errorMessage("An unexpected error occurred")
            : "An unexpected error occurred",
          "failure",
          { duration: 15 * 1000 }
        );
      }

      tagToastErrorProcessed(error);

      throw error;
    }
  }) as T;
};

export const withErrorToastSync = <T extends (...args: any[]) => any>(
  fn: T,
  errorMessage?: string | ((error: string) => string)
): T => {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args);
      return result;
    } catch (error) {
      if (isToastErrorProcessed(error)) {
        throw error;
      }

      if (error instanceof Error) {
        doToast(
          typeof errorMessage === "function"
            ? errorMessage(error.message)
            : errorMessage ?? error.message,
          "failure",
          { duration: 15 * 1000 }
        );
      } else {
        doToast(
          typeof errorMessage === "function"
            ? errorMessage("An unexpected error occurred")
            : "An unexpected error occurred",
          "failure",
          { duration: 15 * 1000 }
        );
      }

      tagToastErrorProcessed(error);

      throw error;
    }
  }) as T;
};
