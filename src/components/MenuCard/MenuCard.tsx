import clsx from "clsx";

import { MenuCardOption } from "./MenuCardOption";

export type IMenuCardProps = {
  beforeContent?: React.ReactNode;
  afterContent?: React.ReactNode;
  className?: string;
  children?: React.ReactElement<typeof MenuCardOption> | React.ReactElement<typeof MenuCardOption>[];
};

export const MenuCardBase = ({
  beforeContent,
  afterContent,
  className,
  children,
}: IMenuCardProps) => {
  return (
    <div className={clsx("card flex flex-col gap-3 px-2 py-3", className)}>
      {beforeContent}
      <div className="flex flex-col gap-1">{children}</div>
      {afterContent}
    </div>
  );
};

export const MenuCard = Object.assign(MenuCardBase, {
  displayName: "MenuCard",
  Option: MenuCardOption,
});
