const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <p className="text-sm text-slate-500">{title}</p>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
  </div>
);

export default StatCard;
