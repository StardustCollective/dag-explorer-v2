import clsx from "clsx";
import { useRef } from "react";


import { useClickOutside } from "@/hooks";

export type IMenuCardProps = {
  beforeContent?: React.ReactNode;
  afterContent?: React.ReactNode;
  onClickOutside?: () => void;
  className?: string;
  children?: React.ReactNode;
};

export const MenuCard = ({
  beforeContent,
  afterContent,
  className,
  children,
  onClickOutside,
}: IMenuCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, onClickOutside);

  return (
    <div
      className={clsx("card flex flex-col gap-3 px-2 py-3", className)}
      ref={ref}
    >
      {beforeContent}
      <div className="flex flex-col gap-1">{children}</div>
      {afterContent}
    </div>
  );
};
