import Link from "next/link";
import { PageLayout } from "../PageLayout";

export type IHeaderProps = Record<string, never>;

export const Header = ({}: IHeaderProps) => {
  return (
    <PageLayout
      className={{
        wrapper: "bg-hgtp-blue-600",
        children:
          "flex justify-between items-center h-20 px-20 text-white font-medium",
      }}
    >
      <Link className="flex gap-2.5 font-twk-laus font-medium text-2xl" href="/">
        DAG Explorer
      </Link>
      <div className="flex gap-4">
        <Link className="flex gap-2 items-center h-9 px-4.5" href="/metagraphs">
          Metagraphs
        </Link>
        <Link
          className="flex gap-2 items-center h-9 px-4.5"
          href="/staking"
        >
          Delegated staking
        </Link>
      </div>
      <div className="flex gap-4">
        <button className="button outline sm font-medium">Mainnet 2.0</button>
        <button className="button primary sm">Connect wallet</button>
      </div>
    </PageLayout>
  );
};
