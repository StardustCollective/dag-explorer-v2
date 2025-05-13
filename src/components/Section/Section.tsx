import clsx from "clsx";

export type ISectionProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string | { wrapper?: string; children?: string };
  children?: React.ReactNode;
};

export const Section = ({
  title,
  subtitle,
  action,
  className,
  children,
}: ISectionProps) => {
  className =
    typeof className === "object" ? className : { children: className };

  return (
    <section className={clsx("flex flex-col gap-5", className.wrapper)}>
      {(title || subtitle) && (
        <div className="flex flex-col gap-3">
          {title && (
            <div className="flex flex-col items-center lg:flex-row lg:flex-nowrap lg:justify-between lg:items-end">
              <h2 className="text-2xl text-hgtp-blue-900 font-medium lg:text-left text-center">
                {title}
              </h2>
              {action}
            </div>
          )}
          {subtitle && <p className="font-medium text-gray-600">{subtitle}</p>}
        </div>
      )}
      <div className={className.children}>{children}</div>
    </section>
  );
};
