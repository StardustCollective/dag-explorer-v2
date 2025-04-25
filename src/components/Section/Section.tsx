import clsx from "clsx";

export type ISectionProps = {
  title?: React.ReactNode;
  action?: React.ReactNode;
  className?: string | { wrapper?: string; children?: string };
  children?: React.ReactNode;
};

export const Section = ({
  title,
  action,
  className,
  children,
}: ISectionProps) => {
  className =
    typeof className === "object" ? className : { children: className };

  return (
    <section className={clsx("flex flex-col gap-5", className.wrapper)}>
      {title && (
        <div className="flex flex-col items-center md:flex-row md:flex-nowrap md:justify-between md:items-end">
          <h2 className="text-2xl text-hgtp-blue-900 font-medium md:text-left text-center">
            {title}
          </h2>
          {action}
        </div>
      )}
      <div className={className.children}>{children}</div>
    </section>
  );
};
