import EmptyState from './EmptyState.jsx';

const DataTable = ({
  columns,
  data,
  rowKey = 'id',
  emptyTitle = 'No records yet',
  emptyDescription = 'Add your first item to populate this table.',
  selectable = false,
  selectedRows = [],
  onToggleRow,
  onToggleAll
}) => {
  if (!data.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} icon="🗂️" />;
  }

  const allSelected = selectable && data.length > 0 && selectedRows.length === data.length;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/5">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-slate-200">
          <thead>
            <tr className="border-b border-white/10 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 text-left text-slate-300">
              {selectable && (
                <th className="px-4 py-3 font-semibold">
                  <input type="checkbox" checked={allSelected} onChange={() => onToggleAll?.()} />
                </th>
              )}
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-semibold">{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row[rowKey]} className="border-b border-white/5 transition-colors duration-200 hover:bg-cyan-500/10">
                {selectable && (
                  <td className="px-4 py-3 align-middle">
                    <input type="checkbox" checked={selectedRows.includes(row[rowKey])} onChange={() => onToggleRow?.(row[rowKey])} />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 align-middle">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
