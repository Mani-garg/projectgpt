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
      <div className="min-h-screen bg-[#eef0f3] p-8">
        <Skeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef0f3] p-3 md:p-5">
      <NotificationToast items={notification.toasts} onDismiss={notification.dismiss} />
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Phenomenon Product for Phenomenon Studio</p>
          <p className="text-xs text-emerald-600">Available for work</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Follow</button>
          <button onClick={logout} className="rounded-full bg-[#0d1021] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1f274a] transition">Get in touch</button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-rise-in">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">All sites</p>
              <h1 className="text-2xl font-semibold text-slate-900">Welcome, {company.name}</h1>
              <p className="text-sm text-slate-500">Monitor your textile operations with a cleaner analytics-first layout.</p>
            </div>
            <p className="text-sm text-slate-500">Live business metrics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {stats.map((stat) => <EnhancedStatCard key={stat.title} {...stat} />)}
          </div>

          {error && <p className="text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-sm">{error}</p>}

          {activeTab === 'materials' && (
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-800">Raw Materials & Units</h2>
                <input className="border border-slate-200 bg-white text-slate-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm md:w-72" placeholder="Search material name..." value={materialSearch} onChange={(e) => setMaterialSearch(e.target.value)} />
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
                  { key: 'unit', label: 'Unit', render: (row) => <span className="uppercase text-xs tracking-wide text-slate-500">{row.unit || 'kg'}</span> },
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
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
              <h2 className="text-lg font-semibold text-slate-800">Production</h2>
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
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
              <h2 className="text-lg font-semibold text-slate-800">Sales</h2>
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
                  <ResponsiveContainer width="100%" height="100%"><LineChart data={data.analytics.dailySales}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="date" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip /><Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer>
                </div>
              </ChartCard>
              <ChartCard title="Daily Production Cost" change={-2.1}>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%"><BarChart data={data.analytics.dailyCost}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="date" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip /><Bar dataKey="total" fill="#f59e0b" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer>
                </div>
              </ChartCard>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
                <h3 className="font-semibold mb-2 text-slate-800">Low Stock Warnings</h3>
                {data.lowStock.length === 0 ? <EmptyState title="Inventory is healthy" description="No low stock alerts right now." icon="✅" /> : <ul className="list-disc pl-5 text-slate-700">{data.lowStock.map((item) => <li key={item.id}>{item.name} ({item.quantity} {item.unit || 'kg'})</li>)}</ul>}
              </div>
            </section>
          )}

          {activeTab === 'insights' && (
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">Business Insights</h2>
              <button onClick={fetchInsights} className="primary-btn px-4 py-2 rounded-lg" disabled={loading}>Generate Business Insights</button>
              {insights ? <pre className="bg-slate-100 text-slate-700 p-3 rounded whitespace-pre-wrap text-sm">{insights}</pre> : <EmptyState title="No insights yet" description="Generate AI insights to get recommendations." icon="🧠" />}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
