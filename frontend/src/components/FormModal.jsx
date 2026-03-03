const FormModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label="Close modal" />
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/20 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          <button onClick={onClose} className="rounded bg-white/10 px-2 py-1 text-slate-300 hover:bg-white/20">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default FormModal;
