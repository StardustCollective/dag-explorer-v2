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
      <div className="flex flex-nowrap justify-between">
        <h2 className="text-2xl text-hgtp-blue-900 font-semibold">{title}</h2>
        {action}
      </div>
      <div className={className.children}>{children}</div>
    </section>
  );
};
