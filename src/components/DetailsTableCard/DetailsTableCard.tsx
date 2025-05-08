import clsx from "clsx";

export type IDetailsTableCardProps = {
  rows: (
    | { label?: React.ReactNode; value?: React.ReactNode }
    | null
    | undefined
    | false
  )[];
  className?: string;
};

export const DetailsTableCard = ({
  rows,
  className,
}: IDetailsTableCardProps) => {
  return (
    <table
      className={clsx(
        "card rounded-xl border-separate border-spacing-0",
        className
      )}
    >
      <tbody>
        {rows.map(
          (row, idx) =>
            row && (
              <tr
                key={idx}
                className={clsx(
                  "[&_td]:py-2.5",
                  "[&_td]:px-2",
                  "[&_td:first-child]:pl-3",
                  "[&_td:last-child]:pr-3",

                  "lg:[&_td]:py-5",
                  "lg:[&_td]:px-2",
                  "lg:[&_td:first-child]:pl-6",
                  "lg:[&_td:last-child]:pr-6",
                  "[&_td]:border-b-gray-200 [&_td]:border-b"
                )}
              >
                <td className="font-semibold text-hgtp-blue-950 opacity-65 w-[20%] max-w-[200px] whitespace-nowrap">
                  {row.label}
                </td>
                <td className="text-gray-900">{row.value}</td>
              </tr>
            )
        )}
      </tbody>
    </table>
  );
};
