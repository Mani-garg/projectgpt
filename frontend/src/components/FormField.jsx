const FormField = ({ label, type = 'text', placeholder, value, onChange, error, options, className = '', ...props }) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-medium text-slate-200">{label}</label>}
    {options ? (
      <select
        className={`w-full rounded-xl border bg-slate-950/40 px-3 py-2.5 text-slate-100 border-slate-600/70 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${className}`}
        value={value}
        onChange={onChange}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        className={`w-full rounded-xl border bg-slate-950/40 px-3 py-2.5 text-slate-100 placeholder:text-slate-400 border-slate-600/70 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
    )}
    {error && <p className="text-xs text-rose-300">{error}</p>}
  </div>
);

export default FormField;
