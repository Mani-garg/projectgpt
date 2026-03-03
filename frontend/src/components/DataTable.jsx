import EmptyState from './EmptyState.jsx';

const DataTable = ({ columns, data, rowKey = 'id', emptyTitle = 'No records yet', emptyDescription = 'Add your first item to populate this table.' }) => {
  if (!data.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} icon="🗂️" />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-slate-700">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-semibold">{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row[rowKey]} className="border-b border-slate-100 transition-colors duration-200 hover:bg-slate-50">
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
