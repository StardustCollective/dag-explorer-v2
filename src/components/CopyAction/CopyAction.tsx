"use client";

import SquareBehindSquareIcon from "@/assets/icons/square_behind_square.svg";

import React from "react";

import clsx from "clsx";

export type ICopyAction = {
  value?: any;
  className?: string;
};

export const CopyAction = ({ value, className }: ICopyAction) => {
  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
    } catch (e) {
      console.log("Copy action failed:");
      console.error(e);
    }
  };

  return (
    <SquareBehindSquareIcon
      onClick={doCopy}
      className={clsx(
        "inline-flex text-hgtp-blue-400 cursor-pointer",
        !className?.includes("size-") && "size-5",
        className
      )}
    />
  );
};
