import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import EnhancedStatCard from '../components/EnhancedStatCard.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import ChartCard from '../components/ChartCard.jsx';
import FormField from '../components/FormField.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Skeleton from '../components/Skeleton.jsx';
import NotificationToast from '../components/NotificationToast.jsx';
import { useNotification } from '../hooks/useNotification.js';

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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const notification = useNotification();

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
      setError('');
    } catch (err) {
      setError(err.message);
      notification.error(err.message);
    } finally {
      setIsInitialLoading(false);
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
      notification.success(`${type[0].toUpperCase() + type.slice(1)} entry saved successfully.`);
      await loadAllData();
    } catch (err) {
      setError(err.message);
      notification.error(err.message);
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
      notification.success('AI insights generated.');
    } catch (err) {
      setError(err.message);
      notification.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const analytics = data.analytics || { totalSales: 0, totalCost: 0, profit: 0 };
    const salesTrend = (data.analytics?.dailySales || []).map((item) => ({ value: item.total }));
    const costTrend = (data.analytics?.dailyCost || []).map((item) => ({ value: item.total }));
    const profitTrend = salesTrend.map((item, index) => ({ value: item.value - (costTrend[index]?.value || 0) }));

    return [
      { title: 'Total Sales', value: analytics.totalSales || 0, color: 'emerald', trend: salesTrend },
      { title: 'Total Cost', value: analytics.totalCost || 0, color: 'amber', trend: costTrend },
      { title: 'Profit / Loss', value: analytics.profit || 0, color: analytics.profit >= 0 ? 'indigo' : 'rose', trend: profitTrend }
    ];
  }, [data.analytics]);

  const filteredMaterials = useMemo(
    () => data.materials.filter((item) => item.name.toLowerCase().includes(materialSearch.toLowerCase())),
    [data.materials, materialSearch]
  );

  const updateForm = (scope, key, value) => {
    setForms((prev) => ({ ...prev, [scope]: { ...prev[scope], [key]: value } }));
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <Skeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-[radial-gradient(circle_at_top,#164e63_0%,#111827_40%,#020617_100%)]">
      <NotificationToast items={notification.toasts} onDismiss={notification.dismiss} />
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
            {stats.map((stat) => <EnhancedStatCard key={stat.title} {...stat} />)}
          </div>

          {error && <p className="text-rose-200 bg-rose-900/40 border border-rose-300/30 rounded-xl px-3 py-2 text-sm">{error}</p>}

          {activeTab === 'materials' && (
            <section className="bg-white/10 backdrop-blur rounded-2xl p-5 shadow-2xl border border-cyan-100/20 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-100">Raw Materials & Units</h2>
                <input className="border border-slate-500/70 bg-slate-950/30 text-slate-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 text-sm md:w-72" placeholder="Search material name..." value={materialSearch} onChange={(e) => setMaterialSearch(e.target.value)} />
              </div>
              <div className="grid md:grid-cols-5 gap-3">
                {['name', 'quantity', 'cost_per_unit'].map((field) => (
                  <FormField
                    key={field}
                    label={fieldLabels[field] || field}
                    value={forms.materials[field]}
                    onChange={(e) => updateForm('materials', field, e.target.value)}
                  />
                ))}
                <FormField
                  label="Unit"
                  options={materialUnits}
                  value={forms.materials.unit}
                  onChange={(e) => updateForm('materials', 'unit', e.target.value)}
                />
                <button className="primary-btn rounded-lg px-3 mt-7" onClick={() => onSubmit('materials', '/api/materials')} disabled={loading}>Add Material</button>
              </div>
              <DataTable
                columns={[
                  { key: 'name', label: 'Name', render: (row) => <span className="font-medium">{row.name}</span> },
                  { key: 'quantity', label: 'Quantity' },
                  { key: 'unit', label: 'Unit', render: (row) => <span className="uppercase text-xs tracking-wide text-cyan-200">{row.unit || 'kg'}</span> },
                  { key: 'cost_per_unit', label: 'Cost / Unit', render: (row) => `₹${row.cost_per_unit}` },
                  { key: 'status', label: 'Status', render: (row) => <StatusBadge quantity={row.quantity} /> }
                ]}
                data={filteredMaterials}
                emptyTitle="No materials found"
                emptyDescription="Try adding inventory or adjusting your search query."
              />
            </section>
          )}

          {activeTab === 'production' && (
            <section className="bg-white/10 backdrop-blur rounded-2xl p-5 shadow-2xl border border-cyan-100/20 space-y-3">
              <h2 className="text-lg font-semibold text-slate-100">Production</h2>
              <div className="grid md:grid-cols-5 gap-3">
                {['product_name', 'quantity', 'cost', 'date'].map((field) => (
                  <FormField key={field} label={fieldLabels[field] || field} type={field === 'date' ? 'date' : 'text'} value={forms.production[field]} onChange={(e) => updateForm('production', field, e.target.value)} />
                ))}
                <button className="primary-btn rounded-lg px-3 mt-7" onClick={() => onSubmit('production', '/api/production')} disabled={loading}>Add Batch</button>
              </div>
              <DataTable
                columns={[
                  { key: 'product_name', label: 'Product' },
                  { key: 'quantity', label: 'Qty' },
                  { key: 'cost', label: 'Cost', render: (row) => `₹${row.cost}` },
                  { key: 'date', label: 'Date' }
                ]}
                data={data.production}
                emptyTitle="No production batches"
              />
            </section>
          )}

          {activeTab === 'sales' && (
            <section className="bg-white/10 backdrop-blur rounded-2xl p-5 shadow-2xl border border-cyan-100/20 space-y-3">
              <h2 className="text-lg font-semibold text-slate-100">Sales</h2>
              <div className="grid md:grid-cols-6 gap-3">
                {['buyer_name', 'location', 'quantity', 'selling_price', 'date'].map((field) => (
                  <FormField key={field} label={fieldLabels[field] || field} type={field === 'date' ? 'date' : 'text'} value={forms.sales[field]} onChange={(e) => updateForm('sales', field, e.target.value)} />
                ))}
                <button className="primary-btn rounded-lg px-3 mt-7" onClick={() => onSubmit('sales', '/api/sales')} disabled={loading}>Record Sale</button>
              </div>
              <DataTable
                columns={[
                  { key: 'buyer_name', label: 'Buyer' },
                  { key: 'location', label: 'Location' },
                  { key: 'quantity', label: 'Qty' },
                  { key: 'selling_price', label: 'Price', render: (row) => `₹${row.selling_price}` },
                  { key: 'date', label: 'Date' }
                ]}
                data={data.sales}
                emptyTitle="No sales recorded"
              />
            </section>
          )}

          {activeTab === 'analytics' && data.analytics && (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="Daily Sales Trend" change={5.2}>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%"><LineChart data={data.analytics.dailySales}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" /><XAxis dataKey="date" stroke="#cbd5e1" /><YAxis stroke="#cbd5e1" /><Tooltip /><Line type="monotone" dataKey="total" stroke="#22d3ee" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer>
                </div>
              </ChartCard>
              <ChartCard title="Daily Production Cost" change={-2.1}>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%"><BarChart data={data.analytics.dailyCost}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" /><XAxis dataKey="date" stroke="#cbd5e1" /><YAxis stroke="#cbd5e1" /><Tooltip /><Bar dataKey="total" fill="#818cf8" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer>
                </div>
              </ChartCard>
              <div className="rounded-2xl border border-cyan-100/20 bg-white/10 p-4 shadow-2xl backdrop-blur lg:col-span-2">
                <h3 className="font-semibold mb-2 text-slate-100">Low Stock Warnings</h3>
                {data.lowStock.length === 0 ? <EmptyState title="Inventory is healthy" description="No low stock alerts right now." icon="✅" /> : <ul className="list-disc pl-5 text-slate-200">{data.lowStock.map((item) => <li key={item.id}>{item.name} ({item.quantity} {item.unit || 'kg'})</li>)}</ul>}
              </div>
            </section>
          )}

          {activeTab === 'insights' && (
            <section className="bg-white/10 backdrop-blur rounded-2xl p-5 shadow-2xl border border-cyan-100/20 space-y-4">
              <h2 className="text-lg font-semibold text-slate-100">Business Insights</h2>
              <button onClick={fetchInsights} className="primary-btn px-4 py-2 rounded-lg" disabled={loading}>Generate Business Insights</button>
              {insights ? <pre className="bg-slate-950/50 text-slate-100 p-3 rounded whitespace-pre-wrap text-sm">{insights}</pre> : <EmptyState title="No insights yet" description="Generate AI insights to get recommendations." icon="🧠" />}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
