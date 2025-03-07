import { HgtpNetwork } from "@/common/consts";
import { PageLayout } from "../PageLayout";
import { SearchBar } from "../SearchBar";
import { stringFormat } from "@/utils";

export type INetworkHeaderProps = {
  network: HgtpNetwork;
};

export const NetworkHeader = ({ network }: INetworkHeaderProps) => {
  return (
    <PageLayout
      className={{
        wrapper: "bg-c2fc border-b border-gray-300",
        children: "flex justify-between items-end px-20 py-7.5",
      }}
    >
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-xs text-gray-600 uppercase">
          Constellation Network
        </span>
        <span className="font-semibold text-4.5xl text-hgtp-blue-600">
          {stringFormat(network, "TITLE_CASE")}{" "}
          {network === HgtpNetwork.MAINNET_1 ? "1.0" : "2.0"}
        </span>
      </div>
      <SearchBar
        className="w-[629px]"
        placeholder="Search by address, transaction hash..."
      />
    </PageLayout>
  );
};
