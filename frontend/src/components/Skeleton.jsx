const Skeleton = ({ rows = 3 }) => (
  <div className="animate-pulse space-y-4">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-4 bg-slate-700/50 rounded-full w-3/4" />
        <div className="h-4 bg-slate-700/30 rounded-full w-1/2" />
      </div>
    ))}
  </div>
);

export default Skeleton;
