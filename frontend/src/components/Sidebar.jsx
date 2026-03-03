const tabs = [
  { name: 'materials', label: 'Dashboard', icon: '📦' },
  { name: 'production', label: 'Production', icon: '⚡' },
  { name: 'sales', label: 'My sales', icon: '🛒' },
  { name: 'analytics', label: 'Analytics', icon: '📈' },
  { name: 'insights', label: 'Insights', icon: '💡' }
];

const Sidebar = ({ activeTab, setActiveTab }) => (
  <aside className="w-full md:w-72 rounded-3xl bg-[#111418] text-white p-5 shadow-[0_25px_55px_rgba(0,0,0,0.35)] animate-rise-in">
    <h2 className="text-xl font-semibold mb-1 text-white">TrafficTrace</h2>
    <p className="text-xs text-slate-400 mb-6">Main menu</p>
    <ul className="space-y-1.5">
      {tabs.map((tab) => (
        <li key={tab.name}>
          <button
            onClick={() => setActiveTab(tab.name)}
            className={`w-full px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-between ${
              activeTab === tab.name ? 'bg-[#2b3138] text-white' : 'text-slate-300 hover:bg-[#1f242b]'
            }`}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </span>
            {activeTab === tab.name && <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />}
          </button>
        </li>
      ))}
    </ul>
  </aside>
);

export default Sidebar;
