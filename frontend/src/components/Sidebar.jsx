const tabs = ['materials', 'production', 'sales', 'analytics', 'insights'];

const Sidebar = ({ activeTab, setActiveTab }) => (
  <aside className="w-full md:w-64 bg-slate-900 text-white p-4 rounded-xl">
    <h2 className="text-xl font-semibold mb-6">Textile ERP</h2>
    <ul className="space-y-2">
      {tabs.map((tab) => (
        <li key={tab}>
          <button
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left px-3 py-2 rounded-lg capitalize transition ${
              activeTab === tab ? 'bg-indigo-600' : 'hover:bg-slate-700'
            }`}
          >
            {tab}
          </button>
        </li>
      ))}
    </ul>
  </aside>
);

export default Sidebar;
