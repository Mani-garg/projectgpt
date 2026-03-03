const ChartCard = ({ title, change, children }) => {
  const isPositive = change >= 0;

  return (
    <div className="rounded-2xl border border-cyan-100/20 bg-white/10 p-4 shadow-2xl backdrop-blur">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="font-semibold text-slate-100">{title}</h3>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${isPositive ? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200' : 'border-rose-300/30 bg-rose-400/10 text-rose-200'}`}>
          {isPositive ? '↗' : '↘'} {Math.abs(change).toFixed(1)}%
        </span>
      </div>
      {children}
    </div>
  );
};

export default ChartCard;
