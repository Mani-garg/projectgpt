const tabs = ['materials', 'production', 'sales', 'analytics', 'insights'];

const labels = {
  materials: 'Materials',
  production: 'Production',
  sales: 'Sales',
  analytics: 'Analytics',
  insights: 'AI Insights'
};

const Sidebar = ({ activeTab, setActiveTab }) => (
  <aside className="w-full md:w-72 bg-slate-900/70 text-white p-4 rounded-2xl backdrop-blur border border-cyan-200/20 shadow-2xl animate-rise-in">
    <h2 className="text-2xl font-semibold mb-1 bg-gradient-to-r from-cyan-300 via-emerald-300 to-indigo-300 bg-clip-text text-transparent">Textile ERP</h2>
    <p className="text-xs text-slate-300 mb-6">Control center</p>
    <ul className="space-y-2">
      {tabs.map((tab) => (
        <li key={tab}>
          <button
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-between ${
              activeTab === tab ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 shadow-lg shadow-cyan-900/40 -translate-y-0.5' : 'hover:bg-slate-700/70'
            }`}
          >
            <span>{labels[tab]}</span>
            {activeTab === tab && <span className="h-2.5 w-2.5 rounded-full bg-white/90" />}
          </button>
        </li>
      ))}
    </ul>
  </aside>
);

export default Sidebar;
