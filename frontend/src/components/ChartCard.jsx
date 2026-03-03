const ChartCard = ({ title, change, children }) => {
  const isPositive = change >= 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${isPositive ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-rose-200 bg-rose-50 text-rose-500'}`}>
          {isPositive ? '↗' : '↘'} {Math.abs(change).toFixed(1)}%
        </span>
      </div>
      {children}
    </div>
  );
};

export default ChartCard;
