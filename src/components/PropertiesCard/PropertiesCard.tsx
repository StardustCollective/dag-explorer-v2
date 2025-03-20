import clsx from "clsx";

export type IPropertiesCardProps = {
  variants?: "compact"[];
  rows: (
    | { label?: React.ReactNode; value?: React.ReactNode }
    | null
    | undefined
  )[];
  className?: string;
};

export const PropertiesCard = ({
  variants,
  rows,
  className,
}: IPropertiesCardProps) => {
  return (
    <div className={clsx("card flex flex-col gap-3 px-4 py-3.5", className)}>
      {rows.map(
        (row, idx) =>
          row && (
            <div
              key={idx}
              className={clsx(
                "flex items-center justify-between",
                "[&_div]:flex [&_div]:items-center [&_div]:gap-1"
              )}
            >
              <div className="text-hgtp-blue-600 font-medium text-sm">
                {row.label}
              </div>
              <div className="text-sm">{row.value}</div>
            </div>
          )
      )}
    </div>
  );
};
