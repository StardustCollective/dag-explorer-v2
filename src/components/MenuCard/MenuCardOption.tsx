import clsx from "clsx";

export type IMenuCardOptionProps<T extends React.ElementType = "button"> = {
  renderAs?: T;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "className" | "children">;

export const MenuCardOption = <T extends React.ElementType = "button">({
  renderAs,
  className,
  children,
  ...props
}: IMenuCardOptionProps<T>) => {
  const RenderComponent = renderAs ?? "button";

  return (
    <RenderComponent
      className={clsx(
        "flex items-center gap-2 py-1.5 px-2",
        "rounded-sm",
        "text-hgtp-blue-600 font-semibold text-sm",
        "hover:bg-hgtp-blue-50",
        "transition-colors duration-200",
        className
      )}
      {...props}
    >
      {children}
    </RenderComponent>
  );
};
