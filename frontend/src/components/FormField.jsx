const FormField = ({ label, type = 'text', placeholder, value, onChange, error, options, className = '', ...props }) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-medium text-slate-600">{label}</label>}
    {options ? (
      <select
        className={`w-full rounded-xl border bg-white px-3 py-2.5 text-slate-700 border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 ${className}`}
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
        className={`w-full rounded-xl border bg-white px-3 py-2.5 text-slate-700 placeholder:text-slate-400 border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
    )}
    {error && <p className="text-xs text-rose-500">{error}</p>}
  </div>
);

export default FormField;
