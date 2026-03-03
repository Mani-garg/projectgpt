const BulkActions = ({ selectedRows, onDelete, onExport }) => {
  if (!selectedRows.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => onDelete(selectedRows)} className="rounded-lg bg-rose-500/20 px-4 py-2 text-rose-200 hover:bg-rose-500/30">
        🗑️ Delete ({selectedRows.length})
      </button>
      <button onClick={() => onExport(selectedRows)} className="rounded-lg bg-emerald-500/20 px-4 py-2 text-emerald-200 hover:bg-emerald-500/30">
        📥 Export ({selectedRows.length})
      </button>
    </div>
  );
};

export default BulkActions;
