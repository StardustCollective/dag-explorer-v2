import clsx from "clsx";

export type ITypeChipProps = {
  className?: string;
  children: React.ReactNode;
};

export const TypeChip = ({ className, children }: ITypeChipProps) => {
  return (
    <span
      className={clsx(
        "flex items-center justify-center",
        "text-xs font-medium",
        "border rounded-5xl",
        "py-1 px-3.5",
        className
      )}
    >
      {children}
    </span>
  );
};
