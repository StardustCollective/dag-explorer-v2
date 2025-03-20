import clsx from "clsx";

import { InfoTooltip } from "../Tooltip";

export type IStatCardProps = {
  label?: React.ReactNode;
  tooltip?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export const StatCard = ({
  label,
  tooltip,
  className,
  children,
}: IStatCardProps) => {
  return (
    <div
      className={clsx(
        "card flex flex-col gap-3 p-5 w-full border-0.5",
        className
      )}
    >
      <span className="flex items-center text-xs text-gray-500 font-semibold uppercase">
        {label}
        {tooltip && <InfoTooltip  content={tooltip} className="size-4" />}
      </span>
      <span className="text-cd14 font-medium text-2xl">{children}</span>
    </div>
  );
};
