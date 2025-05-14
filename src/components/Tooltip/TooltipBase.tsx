import React from "react";

export type ITooltipBaseProps = {
  title?: string;
  content?: React.ReactNode;
  extraContent?: React.ReactNode;
};

export const TooltipBase = ({
  title,
  content,
  extraContent,
}: ITooltipBaseProps) => {
  return (
    <div className="card shadow-sm flex flex-col gap-3 max-w-[360px] py-1.5 px-2.5 normal-case whitespace-normal">
      <div className="text-sm">
        <span className="font-semibold">{title}</span>
        <div className="font-normal">{content}</div>
      </div>
      {extraContent}
    </div>
  );
};
