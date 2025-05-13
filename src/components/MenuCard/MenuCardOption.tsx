import clsx from "clsx";

export type IMenuCardOptionProps<T extends React.ElementType = "button"> = {
  variant?: "default" | "compact";
  disabled?: boolean;
  renderAs?: T;
  className?: string;
  children?: React.ReactNode;
} & Omit<
  React.ComponentPropsWithoutRef<T>,
  "variant" | "disabled" | "renderAs" | "className" | "children"
>;

export const MenuCardOption = <T extends React.ElementType = "button">({
  variant = "default",
  disabled,
  renderAs,
  className,
  children,
  ...props
}: IMenuCardOptionProps<T>) => {
  const RenderComponent = renderAs ?? "button";

  return (
    <RenderComponent
      className={clsx(
        "flex items-center cursor-pointer",
        "rounded-sm",
        "text-hgtp-blue-600",
        "hover:bg-hgtp-blue-50",
        "transition-colors duration-200",
        "disabled:opacity-50 disabled:hover:bg-transparent",
        variant === "default" && "gap-2 py-1.5 px-2 font-semibold text-sm",
        variant === "compact" && "gap-2 px-1 font-medium text-xs",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </RenderComponent>
  );
};
