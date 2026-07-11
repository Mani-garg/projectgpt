const tabs = [
  { name: 'materials', label: 'Materials', icon: '📦' },
  { name: 'production', label: 'Production', icon: '⚡' },
  { name: 'sales', label: 'Sales', icon: '🛒' },
  { name: 'analytics', label: 'Analytics', icon: '📈' },
  { name: 'insights', label: 'AI Insights', icon: '💡' }
];

const Sidebar = ({ activeTab, setActiveTab }) => (
  <aside className="w-full md:w-72 bg-slate-900/70 text-white p-4 rounded-2xl backdrop-blur border border-cyan-200/20 shadow-2xl animate-rise-in">
    <h2 className="text-2xl font-semibold mb-1 bg-gradient-to-r from-cyan-300 via-emerald-300 to-indigo-300 bg-clip-text text-transparent">Textile ERP</h2>
    <p className="text-xs text-slate-300 mb-6">Control center</p>
    <ul className="space-y-2">
      {tabs.map((tab) => (
        <li key={tab.name}>
          <button
            onClick={() => setActiveTab(tab.name)}
            className={`w-full px-3 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-between ${
              activeTab === tab.name ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 shadow-lg shadow-cyan-900/40 -translate-y-0.5' : 'hover:bg-slate-700/70'
            }`}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </span>
            {activeTab === tab.name && <span className="h-2.5 w-2.5 rounded-full bg-white/90" />}
          </button>
        </li>
      ))}
    </ul>
  </aside>
);

export default Sidebar;
