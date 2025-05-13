import clsx from "clsx";

import { RoundedIcon } from "../RoundedIcon";


import Brain2OutlineIcon from "@/assets/icons/brain-2-outline.svg";
import FileLockIcon from "@/assets/icons/file-lock.svg";
import PeopleCircleFilledIcon from "@/assets/icons/people-circle-filled.svg";

const TypeIconProportions = {
  icon: 10 / 28,
  circle: 14 / 28,
};

const getSquareStyle = (size: number, proportion: number) => {
  return {
    width: size * 4 * proportion,
    height: size * 4 * proportion,
  };
};

export type IValidatorIconProps = {
  iconUrl?: string | null;

  size?: number;
  hideType?: boolean;
  className?: string;
};

export const ValidatorIcon = ({
  iconUrl,
  size = 10,
  hideType,
  className,
}: IValidatorIconProps) => {
  return (
    <div
      className={clsx("relative", "inline-flex items-center justify-center")}
      style={{ width: size * 4, height: size * 4 }}
    >
      <RoundedIcon
        iconUrl={iconUrl}
        className={className}
        size={size}
        fallback={
          <PeopleCircleFilledIcon
            className="shrink-0 text-black/65"
            style={getSquareStyle(size, 1)}
          />
        }
      />
      {!hideType && (
        <div
          className={clsx(
            "absolute bottom-0 right-[-5px]",
            "flex items-center justify-center",
            "bg-white border rounded-full",
            iconUrl && "border-green-600 text-green-600",
            !iconUrl && "border-stgz-purple-700 text-stgz-purple-700"
          )}
          style={getSquareStyle(size, TypeIconProportions.circle)}
        >
          {iconUrl && (
            <Brain2OutlineIcon
              className="shrink-0"
              style={getSquareStyle(size, TypeIconProportions.icon)}
            />
          )}
          {!iconUrl && (
            <FileLockIcon
              className="shrink-0"
              style={getSquareStyle(size, TypeIconProportions.icon)}
            />
          )}
        </div>
      )}
    </div>
  );
};
