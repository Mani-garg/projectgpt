import { useEffect, useState } from 'react';

const initialFilters = {
  startDate: '',
  endDate: '',
  minQuantity: '',
  maxQuantity: '',
  searchText: ''
};

const FilterBar = ({ onFilter, includeDate = true, includeQuantity = true }) => {
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const clearAll = () => setFilters(initialFilters);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
      {includeDate && (
        <>
          <input type="date" value={filters.startDate} onChange={(e) => update('startDate', e.target.value)} className="rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100" />
          <input type="date" value={filters.endDate} onChange={(e) => update('endDate', e.target.value)} className="rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100" />
        </>
      )}
      {includeQuantity && (
        <>
          <input type="number" placeholder="Min qty" value={filters.minQuantity} onChange={(e) => update('minQuantity', e.target.value)} className="w-28 rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100" />
          <input type="number" placeholder="Max qty" value={filters.maxQuantity} onChange={(e) => update('maxQuantity', e.target.value)} className="w-28 rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100" />
        </>
      )}
      <input type="search" placeholder="Search..." value={filters.searchText} onChange={(e) => update('searchText', e.target.value)} className="min-w-48 flex-1 rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100" />
      <button onClick={clearAll} className="rounded-lg border border-white/20 px-3 py-2 text-sm text-slate-200 hover:bg-white/10">Clear</button>
    </div>
  );
};

export default FilterBar;
