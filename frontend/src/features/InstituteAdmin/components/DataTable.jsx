import EmptyState from "./EmptyState";

const DataTable = ({
  columns = [],
  rows = [],
  keyField = "id",
  emptyTitle,
  emptyDescription
}) => {
  if (!rows || rows.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || "No records"}
        description={emptyDescription || "Try adjusting your search or filters."}
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="text-left text-gray-600">
            {columns.map((c) => (
              <th key={c.key} className="px-5 py-3 font-medium">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {rows.map((r) => (
            <tr key={r[keyField]} className="hover:bg-gray-50">
              {columns.map((c) => (
                <td key={c.key} className="px-5 py-3 text-gray-800 align-top">
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
