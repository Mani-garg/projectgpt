const StatCard = ({ title, value }) => (
  <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-5 border border-white/60 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
    <p className="text-sm text-slate-500">{title}</p>
    <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
  </div>
);

export default StatCard;
