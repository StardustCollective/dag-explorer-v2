import clsx from "clsx";

export type IStatCardProps = {
  label?: React.ReactNode;
  tooltip?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export const StatCard = ({ label, className, children }: IStatCardProps) => {
  return (
    <div className={clsx("card flex flex-col gap-3 p-5 w-full border-0.5", className)}>
      <span className="text-xs text-gray-500 font-semibold uppercase">
        {label}
      </span>
      <span className="text-cd14 font-medium text-2xl">{children}</span>
    </div>
  );
};
