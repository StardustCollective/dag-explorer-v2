import clsx from "clsx";

import FileTextIcon from "@/assets/icons/file-text.svg";

export type IEmptyStateProps = {
  variant?: "default" | "dark";
  label?: string;
  renderIcon?: React.ElementType;
  className?: string;
};

export const EmptyState = ({
  variant = "default",
  label,
  renderIcon,
  className,
}: IEmptyStateProps) => {
  const RenderedIcon = renderIcon ?? FileTextIcon;

  return (
    <div
      className={clsx(
        "flex items-center justify-center w-full",
        className?.includes("h-") ? className : "h-[328px]",
        className
      )}
    >
      <div
        className={clsx(
          "flex flex-col items-center justify-center gap-4",
          variant === "default" && "text-black/65",
          variant === "dark" && "text-hgtp-blue-900"
        )}
      >
        <div
          className={clsx(
            "flex items-center justify-center size-16",
            "border-2  rounded-full",
            variant === "default" && "bg-hgtp-blue-25 border-hgtp-blue-100",
            variant === "dark" && "bg-hgtp-blue-25 border-hgtp-blue-100"
          )}
        >
          <RenderedIcon className="size-10.5" />
        </div>
        <span className="text-xl">{label ?? "No data available"}</span>
      </div>
    </div>
  );
};
