import { Section } from "../Section/Section";

export type IMaintenanceSectionProps = {
  title?: string;
  description?: string;
  className?:
    | string
    | { section?: string; title?: string; description?: string };
};

export const MaintenanceSection = ({
  title,
  description,
  className,
}: IMaintenanceSectionProps) => {
  className =
    typeof className === "string" ? { section: className } : className;

  return (
    <Section
      className={{
        wrapper:
          className?.section ??
          "flex flex-col pt-20 justify-center items-center gap-8 max-w-[700px]",
      }}
    >
      <h1
        className={
          className?.title ??
          "text-7xl font-medium text-hgtp-blue-600 text-center"
        }
      >
        🛠️ <br />
        {title ?? "DAG Explorer will be back soon"}
      </h1>
      <p
        className={
          className?.description ?? "text-xl font-medium max-w-180 text-center"
        }
      >
        {description ??
          "We’re currently upgrading the Explorer and adding more resources. Don’t worry your delegated staking and all on-chain activity remain fully secure during this update. Thanks for your patience we’ll be back online shortly!"}
      </p>
    </Section>
  );
};
