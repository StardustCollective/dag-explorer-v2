import clsx from "clsx";

import { PageLayout } from "../PageLayout";

export type IPageTitleProps = {
  icon?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export const PageTitle = ({
  icon,
  rightContent,
  className,
  children,
}: IPageTitleProps) => {
  return (
    <PageLayout
      className={{
        wrapper: "border-b border-gray-300",
        children: clsx("flex flex-col md:flex-row md:flex-nowrap justify-between px-4 md:px-20 py-5 gap-4 items-center", className),
      }}
    >
      <h1 className="flex items-center gap-2 text-hgtp-blue-900 font-medium text-2.5xl">
        {icon} {children}
      </h1>
      {rightContent && <div>{rightContent}</div>}
    </PageLayout>
  );
};
