
import { HgtpNetwork } from "@/common/consts";

export type INetworksOnlyProps = {
  network: HgtpNetwork;
  onlyOn?: HgtpNetwork[];
  exceptOn?: HgtpNetwork[];
  children?: React.ReactNode;
};

export const NetworksOnly = ({
  network,
  onlyOn,
  exceptOn,
  children,
}: INetworksOnlyProps) => {
  if (onlyOn && onlyOn.includes(network)) {
    return children;
  }

  if (exceptOn && !exceptOn.includes(network)) {
    return children;
  }

  return null;
};
