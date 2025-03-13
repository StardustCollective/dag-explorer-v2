import clsx from "clsx";

import { PageLayout } from "../PageLayout";

export type IPageTitleProps = {
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export const PageTitle = ({ icon, className, children }: IPageTitleProps) => {
  return (
    <PageLayout
      className={{
        wrapper: "border-b border-gray-300",
        children: clsx("flex flex-nowrap gap-2 px-20 py-5", className),
      }}
    >
      <h1 className="text-hgtp-blue-900 font-medium text-2.5xl">{icon} {children}</h1>
    </PageLayout>
  );
};
