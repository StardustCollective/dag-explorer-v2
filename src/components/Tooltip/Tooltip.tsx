"use client";

import React, { useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

import { ITooltipBaseProps, TooltipBase } from "./TooltipBase";

export type ITooltipPropsCore<E extends React.ElementType = any> = Omit<
  React.ComponentPropsWithoutRef<E extends React.ElementType ? E : "div">,
  "value" | "fallback" | "renderAs"
> & {
  renderAs?: E;
  renderTooltip?: React.ReactNode;
  tooltip?: Omit<React.ComponentProps<typeof ReactTooltip>, "content">;
};

export type ITooltipProps<E extends React.ElementType = any> =
  ITooltipPropsCore<E> & Omit<ITooltipBaseProps, keyof ITooltipPropsCore<E>>;

export const Tooltip = <E extends React.ElementType = any>({
  title,
  content,
  extraContent,
  tooltip,
  renderAs,
  renderTooltip,
  ...props
}: ITooltipProps<E>) => {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    setId(`tooltip-${Math.random()}`.replaceAll(".", ""));
  }, []);

  const Rendered = renderAs ?? "span";

  return (
    <>
      <Rendered {...props} id={id ?? undefined} />
      {id && (
        <ReactTooltip
          place="right"
          {...tooltip}
          anchorSelect={`#${id}`}
          disableStyleInjection
          opacity={100}
          className="z-10"
        >
          {renderTooltip ?? <TooltipBase {...{ title, content, extraContent }} />}
        </ReactTooltip>
      )}
    </>
  );
};
