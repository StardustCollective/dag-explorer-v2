"use client";

import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

import { ITooltipBaseProps, TooltipBase } from "./TooltipBase";

import InformationIcon from "@/assets/icons/information.svg";

export type IInfoTooltipProps = ITooltipBaseProps &
  Omit<React.ComponentProps<typeof Tooltip>, "content"> & {
    renderIcon?: "information-icon";
    className?: string;
  };

export const InfoTooltip = ({
  title,
  content,
  extraContent,
  renderIcon,
  className,
  ...props
}: IInfoTooltipProps) => {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    setId(`tooltip-${Math.random()}`.replaceAll(".", ""));
  }, []);

  renderIcon = renderIcon ?? "information-icon";

  return (
    <>
      {renderIcon === "information-icon" && (
        <InformationIcon
          className={clsx(
            "inline-flex",
            "cursor-pointer mb-[2.2px]",
            "text-gray-500",
            "outline-none border-none",
            className,
            !className?.includes("size-") && "size-3"
          )}
          id={id}
        />
      )}
      {id && (
        <Tooltip
          place="right"
          {...props}
          anchorSelect={`#${id}`}
          disableStyleInjection
          opacity={100}
          className="z-10"
        >
          <TooltipBase {...{ title, content, extraContent }} />
        </Tooltip>
      )}
    </>
  );
};
