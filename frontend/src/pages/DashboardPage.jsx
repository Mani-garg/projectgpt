import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import StatCard from '../components/StatCard.jsx';

const initialForms = {
  materials: { name: '', quantity: '', cost_per_unit: '' },
  production: { product_name: '', quantity: '', cost: '', date: '' },
  sales: { buyer_name: '', location: '', quantity: '', selling_price: '', date: '' }
};

const DashboardPage = () => {
  const { company, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('materials');
  const [forms, setForms] = useState(initialForms);
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
      { title: 'Total Sales', value: `₹${analytics.totalSales?.toFixed?.(2) || analytics.totalSales}` },
      { title: 'Total Cost', value: `₹${analytics.totalCost?.toFixed?.(2) || analytics.totalCost}` },
      { title: 'Profit/Loss', value: `₹${analytics.profit?.toFixed?.(2) || analytics.profit}` }
    ];
  }, [data.analytics]);

  return (
    <div className="min-h-screen p-4 md:p-6 bg-slate-100">
      <div className="flex flex-col md:flex-row gap-4">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 space-y-4">
          <div className="bg-white rounded-xl p-4 shadow flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Welcome, {company.name}</h1>
              <p className="text-sm text-slate-500">Manage textile operations in one place.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={logout} className="px-3 py-1.5 bg-slate-900 text-white rounded">Logout</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {activeTab === 'materials' && (
            <section className="bg-white rounded-xl p-4 shadow space-y-3">
              <h2 className="text-lg font-semibold">Raw Materials</h2>
              <div className="grid md:grid-cols-4 gap-2">
                {['name', 'quantity', 'cost_per_unit'].map((field) => (
                  <input key={field} className="border p-2 rounded" placeholder={field} value={forms.materials[field]} onChange={(e) => setForms((p) => ({ ...p, materials: { ...p.materials, [field]: e.target.value } }))} />
                ))}
                <button className="bg-indigo-600 text-white rounded px-3" onClick={() => onSubmit('materials', '/api/materials')} disabled={loading}>Add</button>
              </div>
              <div className="overflow-auto">
                <table className="w-full text-sm"><thead><tr className="text-left"><th>Name</th><th>Qty</th><th>CPU</th></tr></thead><tbody>{data.materials.map((m) => <tr key={m.id}><td>{m.name}</td><td>{m.quantity}</td><td>{m.cost_per_unit}</td></tr>)}</tbody></table>
              </div>
            </section>
          )}

          {activeTab === 'production' && (
            <section className="bg-white rounded-xl p-4 shadow space-y-3">
              <h2 className="text-lg font-semibold">Production</h2>
              <div className="grid md:grid-cols-6 gap-2">
                {['product_name', 'quantity', 'cost', 'date'].map((field) => (
                  <input key={field} type={field === 'date' ? 'date' : 'text'} className="border p-2 rounded" placeholder={field} value={forms.production[field]} onChange={(e) => setForms((p) => ({ ...p, production: { ...p.production, [field]: e.target.value } }))} />
                ))}
                <button className="bg-indigo-600 text-white rounded px-3" onClick={() => onSubmit('production', '/api/production')} disabled={loading}>Add</button>
              </div>
              <table className="w-full text-sm"><thead><tr className="text-left"><th>Product</th><th>Qty</th><th>Cost</th><th>Date</th></tr></thead><tbody>{data.production.map((p) => <tr key={p.id}><td>{p.product_name}</td><td>{p.quantity}</td><td>{p.cost}</td><td>{p.date}</td></tr>)}</tbody></table>
            </section>
          )}

          {activeTab === 'sales' && (
            <section className="bg-white rounded-xl p-4 shadow space-y-3">
              <h2 className="text-lg font-semibold">Sales</h2>
              <div className="grid md:grid-cols-7 gap-2">
                {['buyer_name', 'location', 'quantity', 'selling_price', 'date'].map((field) => (
                  <input key={field} type={field === 'date' ? 'date' : 'text'} className="border p-2 rounded" placeholder={field} value={forms.sales[field]} onChange={(e) => setForms((p) => ({ ...p, sales: { ...p.sales, [field]: e.target.value } }))} />
                ))}
                <button className="bg-indigo-600 text-white rounded px-3" onClick={() => onSubmit('sales', '/api/sales')} disabled={loading}>Add</button>
              </div>
              <table className="w-full text-sm"><thead><tr className="text-left"><th>Buyer</th><th>Location</th><th>Qty</th><th>Price</th><th>Date</th></tr></thead><tbody>{data.sales.map((s) => <tr key={s.id}><td>{s.buyer_name}</td><td>{s.location}</td><td>{s.quantity}</td><td>{s.selling_price}</td><td>{s.date}</td></tr>)}</tbody></table>
            </section>
          )}

          {activeTab === 'analytics' && data.analytics && (
            <section className="grid lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow h-80">
                <h3 className="font-semibold mb-2">Daily Sales</h3>
                <ResponsiveContainer width="100%" height="100%"><LineChart data={data.analytics.dailySales}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="total" stroke="#4f46e5" /></LineChart></ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl p-4 shadow h-80">
                <h3 className="font-semibold mb-2">Daily Production Cost</h3>
                <ResponsiveContainer width="100%" height="100%"><BarChart data={data.analytics.dailyCost}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Legend /><Bar dataKey="total" fill="#0ea5e9" /></BarChart></ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl p-4 shadow lg:col-span-2">
                <h3 className="font-semibold mb-2">Low Stock Warnings</h3>
                {data.lowStock.length === 0 ? <p className="text-green-600">No low stock alerts 🎉</p> : <ul className="list-disc pl-5">{data.lowStock.map((item) => <li key={item.id}>{item.name} ({item.quantity})</li>)}</ul>}
              </div>
            </section>
          )}

          {activeTab === 'insights' && (
            <section className="bg-white rounded-xl p-4 shadow space-y-4">
              <h2 className="text-lg font-semibold">Business Insights</h2>
              <button onClick={fetchInsights} className="bg-emerald-600 text-white px-3 py-2 rounded" disabled={loading}>Generate Business Insights</button>
              {insights && <pre className="bg-slate-100 p-3 rounded whitespace-pre-wrap text-sm">{insights}</pre>}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
