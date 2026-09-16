import type { ReactNode } from "react";

export interface TableColumn {
  header: ReactNode;
  className?: string;
}

export interface TableRow {
  cells: ReactNode[];
  cellClassNames?: (string | undefined)[];
}

/**
 * Reusable data table. Styling via the `.table`/`.alt-table` classes passed
 * as `className`.
 */
export function Table({
  columns,
  rows,
  className = "table",
}: {
  columns: TableColumn[];
  rows: TableRow[];
  className?: string;
}) {
  return (
    <table className={className}>
      <thead>
        <tr>
          {columns.map((c, i) => (
            <th key={i} className={c.className}>
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.cells.map((cell, ci) => (
              <td key={ci} className={row.cellClassNames?.[ci]}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}