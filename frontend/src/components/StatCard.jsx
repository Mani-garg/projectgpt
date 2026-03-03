const toneStyles = {
  emerald: 'from-emerald-500/15 to-emerald-100/70 text-emerald-700',
  amber: 'from-amber-500/15 to-amber-100/70 text-amber-700',
  indigo: 'from-indigo-500/15 to-indigo-100/70 text-indigo-700',
  rose: 'from-rose-500/15 to-rose-100/70 text-rose-700'
};

const StatCard = ({ title, value, tone = 'indigo' }) => (
  <div className={`bg-gradient-to-br ${toneStyles[tone]} backdrop-blur rounded-2xl shadow-lg p-5 border border-white/70 hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}>
    <p className="text-sm/5 font-medium opacity-80">{title}</p>
    <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
  </div>
);

export default StatCard;
