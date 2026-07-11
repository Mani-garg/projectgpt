const EmptyState = ({ title, description, icon = '📭' }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 p-6 rounded-full mb-4 text-4xl">
      <span aria-hidden="true">{icon}</span>
    </div>
    <h3 className="text-lg font-semibold text-slate-200 mt-4">{title}</h3>
    {description && <p className="mt-2 text-sm text-slate-300 max-w-md">{description}</p>}
  </div>
);

export default EmptyState;
