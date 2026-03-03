import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import StatCard from '../components/StatCard.jsx';

const materialUnits = ['kg', 'g', 'm', 'cm', 'litre', 'pcs', 'rolls', 'cones'];

const initialForms = {
  materials: { name: '', quantity: '', cost_per_unit: '', unit: 'kg' },
  production: { product_name: '', quantity: '', cost: '', date: '' },
  sales: { buyer_name: '', location: '', quantity: '', selling_price: '', date: '' }
};

const fieldLabels = {
  product_name: 'Product name',
  buyer_name: 'Buyer name',
  cost_per_unit: 'Cost per unit',
  selling_price: 'Selling price'
};

const DashboardPage = () => {
  const { company, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('materials');
  const [forms, setForms] = useState(initialForms);
  const [materialSearch, setMaterialSearch] = useState('');
  const [data, setData] = useState({ materials: [], production: [], sales: [], analytics: null, lowStock: [] });
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadAllData = async () => {
    if (!company?.id) return;
    try {
      const [materials, production, sales, analytics] = await Promise.all([
        api(`/api/materials/${company.id}`),
        api(`/api/production/${company.id}`),
        api(`/api/sales/${company.id}`),
        api(`/api/analytics/${company.id}`)
      ]);

      setData({
        materials: materials.materials,
        production: production.production,
        sales: sales.sales,
        analytics,
        lowStock: analytics.lowStock || []
      });
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [company?.id]);

  const onSubmit = async (type, endpoint) => {
    setLoading(true);
    setError('');
    try {
      await api(endpoint, {
        method: 'POST',
        body: JSON.stringify({ company_id: company.id, ...forms[type] })
      });
      setForms((prev) => ({ ...prev, [type]: initialForms[type] }));
      await loadAllData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api('/api/insights', {
        method: 'POST',
        body: JSON.stringify({
          materials: data.materials,
          production: data.production,
          sales: data.sales
        })
      });
      setInsights(res.insights);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const analytics = data.analytics || { totalSales: 0, totalCost: 0, profit: 0 };
    return [
      { title: 'Total Sales', value: `₹${analytics.totalSales?.toFixed?.(2) || analytics.totalSales}`, tone: 'emerald' },
      { title: 'Total Cost', value: `₹${analytics.totalCost?.toFixed?.(2) || analytics.totalCost}`, tone: 'amber' },
      { title: 'Profit / Loss', value: `₹${analytics.profit?.toFixed?.(2) || analytics.profit}`, tone: analytics.profit >= 0 ? 'indigo' : 'rose' }
    ];
  }, [data.analytics]);

  const filteredMaterials = useMemo(
    () => data.materials.filter((item) => item.name.toLowerCase().includes(materialSearch.toLowerCase())),
    [data.materials, materialSearch]
  );

  const updateForm = (scope, key, value) => {
    setForms((prev) => ({ ...prev, [scope]: { ...prev[scope], [key]: value } }));
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-[radial-gradient(circle_at_top,#164e63_0%,#111827_40%,#020617_100%)]">
      <div className="flex flex-col md:flex-row gap-4">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 space-y-4">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-5 shadow-2xl border border-cyan-100/60 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-rise-in">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-600">Smart Manufacturing Suite</p>
              <h1 className="text-2xl font-semibold text-slate-800">Welcome, {company.name}</h1>
              <p className="text-sm text-slate-600">Fresh palette, cleaner workflows, and richer material intelligence.</p>
            </div>
            <button onClick={logout} className="px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition">Logout</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
          </div>

          {error && <p className="text-rose-200 bg-rose-900/40 border border-rose-300/30 rounded-xl px-3 py-2 text-sm">{error}</p>}

          {activeTab === 'materials' && (
            <section className="bg-white/90 backdrop-blur rounded-2xl p-5 shadow-2xl border border-cyan-100/60 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-800">Raw Materials & Units</h2>
                <input className="border border-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 text-sm md:w-72" placeholder="Search material name..." value={materialSearch} onChange={(e) => setMaterialSearch(e.target.value)} />
              </div>
              <div className="grid md:grid-cols-5 gap-2">
                {['name', 'quantity', 'cost_per_unit'].map((field) => (
                  <input
                    key={field}
                    className="border border-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    placeholder={fieldLabels[field] || field}
                    value={forms.materials[field]}
                    onChange={(e) => updateForm('materials', field, e.target.value)}
                  />
                ))}
                <select className="border border-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-white" value={forms.materials.unit} onChange={(e) => updateForm('materials', 'unit', e.target.value)}>
                  {materialUnits.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                </select>
                <button className="primary-btn rounded-lg px-3" onClick={() => onSubmit('materials', '/api/materials')} disabled={loading}>Add Material</button>
              </div>
              <div className="overflow-auto rounded-xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-600 bg-slate-100/70">
                      <th className="p-2">Name</th>
                      <th className="p-2">Quantity</th>
                      <th className="p-2">Unit</th>
                      <th className="p-2">Cost / Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMaterials.map((m) => (
                      <tr key={m.id} className="border-t border-slate-100">
                        <td className="p-2 font-medium text-slate-700">{m.name}</td>
                        <td className="p-2">{m.quantity}</td>
                        <td className="p-2 uppercase text-xs tracking-wide text-cyan-700">{m.unit || 'kg'}</td>
                        <td className="p-2">₹{m.cost_per_unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'production' && (
            <section className="bg-white/90 backdrop-blur rounded-2xl p-5 shadow-2xl border border-cyan-100/60 space-y-3">
              <h2 className="text-lg font-semibold text-slate-800">Production</h2>
              <div className="grid md:grid-cols-6 gap-2">
                {['product_name', 'quantity', 'cost', 'date'].map((field) => (
                  <input key={field} type={field === 'date' ? 'date' : 'text'} className="border border-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300" placeholder={fieldLabels[field] || field} value={forms.production[field]} onChange={(e) => updateForm('production', field, e.target.value)} />
                ))}
                <button className="primary-btn rounded-lg px-3" onClick={() => onSubmit('production', '/api/production')} disabled={loading}>Add Batch</button>
              </div>
              <table className="w-full text-sm"><thead><tr className="text-left text-slate-600"><th>Product</th><th>Qty</th><th>Cost</th><th>Date</th></tr></thead><tbody>{data.production.map((p) => <tr key={p.id}><td>{p.product_name}</td><td>{p.quantity}</td><td>₹{p.cost}</td><td>{p.date}</td></tr>)}</tbody></table>
            </section>
          )}

          {activeTab === 'sales' && (
            <section className="bg-white/90 backdrop-blur rounded-2xl p-5 shadow-2xl border border-cyan-100/60 space-y-3">
              <h2 className="text-lg font-semibold text-slate-800">Sales</h2>
              <div className="grid md:grid-cols-7 gap-2">
                {['buyer_name', 'location', 'quantity', 'selling_price', 'date'].map((field) => (
                  <input key={field} type={field === 'date' ? 'date' : 'text'} className="border border-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300" placeholder={fieldLabels[field] || field} value={forms.sales[field]} onChange={(e) => updateForm('sales', field, e.target.value)} />
                ))}
                <button className="primary-btn rounded-lg px-3" onClick={() => onSubmit('sales', '/api/sales')} disabled={loading}>Record Sale</button>
              </div>
              <table className="w-full text-sm"><thead><tr className="text-left text-slate-600"><th>Buyer</th><th>Location</th><th>Qty</th><th>Price</th><th>Date</th></tr></thead><tbody>{data.sales.map((s) => <tr key={s.id}><td>{s.buyer_name}</td><td>{s.location}</td><td>{s.quantity}</td><td>₹{s.selling_price}</td><td>{s.date}</td></tr>)}</tbody></table>
            </section>
          )}

          {activeTab === 'analytics' && data.analytics && (
            <section className="grid lg:grid-cols-2 gap-4">
              <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-2xl border border-cyan-100/60 h-80">
                <h3 className="font-semibold mb-2 text-slate-800">Daily Sales</h3>
                <ResponsiveContainer width="100%" height="100%"><LineChart data={data.analytics.dailySales}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="total" stroke="#0891b2" /></LineChart></ResponsiveContainer>
              </div>
              <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-2xl border border-cyan-100/60 h-80">
                <h3 className="font-semibold mb-2 text-slate-800">Daily Production Cost</h3>
                <ResponsiveContainer width="100%" height="100%"><BarChart data={data.analytics.dailyCost}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Legend /><Bar dataKey="total" fill="#06b6d4" /></BarChart></ResponsiveContainer>
              </div>
              <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-2xl border border-cyan-100/60 lg:col-span-2">
                <h3 className="font-semibold mb-2 text-slate-800">Low Stock Warnings</h3>
                {data.lowStock.length === 0 ? <p className="text-emerald-600">No low stock alerts 🎉</p> : <ul className="list-disc pl-5 text-slate-700">{data.lowStock.map((item) => <li key={item.id}>{item.name} ({item.quantity} {item.unit || 'kg'})</li>)}</ul>}
              </div>
            </section>
          )}

          {activeTab === 'insights' && (
            <section className="bg-white/90 backdrop-blur rounded-2xl p-5 shadow-2xl border border-cyan-100/60 space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">Business Insights</h2>
              <button onClick={fetchInsights} className="primary-btn px-4 py-2 rounded-lg" disabled={loading}>Generate Business Insights</button>
              {insights && <pre className="bg-slate-100 p-3 rounded whitespace-pre-wrap text-sm">{insights}</pre>}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
