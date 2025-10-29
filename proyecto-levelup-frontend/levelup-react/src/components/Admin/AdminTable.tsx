import React from "react";
import "../../styles/admin-table.css";

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

function AdminTable<T extends Record<string, any>>({
  columns,
  data,
}: AdminTableProps<T>) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} style={{ textAlign: "center" }}>
                No hay registros
              </td>
            </tr>
          )}
          {data.map((row, i) => (
            <tr key={(row.id ?? i) as any}>
              {columns.map((col) => (
                <td key={col.key} data-label={col.label}>
                  {col.render ? col.render(row) : String(row[col.key])}
                </td>
              ))}
              <td className="actions-cell" data-label="Acciones">
                {(row as any).__actions}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;
