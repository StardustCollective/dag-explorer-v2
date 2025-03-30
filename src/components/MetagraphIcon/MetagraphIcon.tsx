import { RoundedIcon } from "../RoundedIcon";

import { HgtpNetwork } from "@/common/consts";
import { getMetagraphIconUrl } from "@/queries";

export type IMetagraphIconProps = {
  network: HgtpNetwork;
  metagraphId?: string;
  size?: number;
  className?: string;
};

export const MetagraphIcon = ({
  network,
  metagraphId,
  className,
  size = 10,
}: IMetagraphIconProps) => {
  return (
    <RoundedIcon
      iconUrl={getMetagraphIconUrl(network, metagraphId)}
      className={className}
      size={size}
    />
  );
};
