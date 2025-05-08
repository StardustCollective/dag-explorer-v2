import clsx from "clsx";

export type IPageLayoutProps = {
  className?: string | { wrapper?: string; children?: string };
  renderAs?: React.ElementType;
  children?: React.ReactNode;
};

export const PageLayout = ({
  className,
  renderAs,
  children,
}: IPageLayoutProps) => {
  className =
    typeof className === "object" ? className : { children: className };

  const RenderComponent = renderAs ?? "div";

  return (
    <div
      className={clsx(
        "flex flex-row flex-nowrap justify-center items-center w-full",
        className.wrapper
      )}
    >
      <RenderComponent
        className={clsx("w-full max-w-[1440px]", className.children)}
      >
        {children}
      </RenderComponent>
    </div>
  );
};
