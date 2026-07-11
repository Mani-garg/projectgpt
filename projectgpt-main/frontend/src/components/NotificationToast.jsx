const toneClasses = {
  success: 'border-emerald-400/40 bg-emerald-500/20 text-emerald-100',
  error: 'border-rose-400/40 bg-rose-500/20 text-rose-100'
};

const NotificationToast = ({ items, onDismiss }) => (
  <div className="fixed right-4 top-4 z-50 space-y-2">
    {items.map((item) => (
      <div key={item.id} className={`min-w-64 rounded-xl border px-4 py-3 shadow-xl backdrop-blur ${toneClasses[item.type] || toneClasses.success}`}>
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm">{item.message}</p>
          <button className="text-xs opacity-80 hover:opacity-100" onClick={() => onDismiss(item.id)}>✕</button>
        </div>
      </div>
    ))}
  </div>
);

export default NotificationToast;
