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
import FilterBar from '../components/FilterBar.jsx';
import BulkActions from '../components/BulkActions.jsx';
import FormModal from '../components/FormModal.jsx';
import { useNotification } from '../hooks/useNotification.js';
import { useImportExport } from '../hooks/useImportExport.js';

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
  const notification = useNotification();
  const { exportToCSV, importFromCSV } = useImportExport();

  const [activeTab, setActiveTab] = useState('materials');
  const [forms, setForms] = useState(initialForms);
  const [data, setData] = useState({ materials: [], production: [], sales: [], analytics: null, lowStock: [] });
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [editing, setEditing] = useState({ type: null, item: null });
  const [activeModal, setActiveModal] = useState(null);

  const endpointMap = { materials: '/api/materials', production: '/api/production', sales: '/api/sales' };

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

  useEffect(() => {
    setSelectedRows([]);
  }, [activeTab]);

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
      setActiveModal(null);
      await loadAllData();
    } catch (err) {
      setError(err.message);
      notification.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async () => {
    if (!editing.type || !editing.item) return;
    setLoading(true);
    try {
      await api(`${endpointMap[editing.type]}/${editing.item.id}`, {
        method: 'PUT',
        body: JSON.stringify({ company_id: company.id, ...forms[editing.type] })
      });
      notification.success('Record updated successfully.');
      setEditing({ type: null, item: null });
      setActiveModal(null);
      await loadAllData();
    } catch (err) {
      setError(err.message);
      notification.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await api(`${endpointMap[type]}/${id}?company_id=${company.id}`, { method: 'DELETE' });
      notification.success('Record deleted successfully.');
      await loadAllData();
    } catch (err) {
      setError(err.message);
      notification.error(err.message);
    }
  };

  const onBulkDelete = async (rows) => {
    if (!rows.length) return;
    if (!window.confirm(`Delete ${rows.length} selected record(s)?`)) return;
    try {
      await Promise.all(rows.map((id) => api(`${endpointMap[activeTab]}/${id}?company_id=${company.id}`, { method: 'DELETE' })));
      notification.success(`${rows.length} record(s) deleted.`);
      setSelectedRows([]);
      await loadAllData();
    } catch (err) {
      notification.error(err.message);
    }
  };

  const onBulkExport = (rows) => {
    const records = filteredData.filter((row) => rows.includes(row.id));
    exportToCSV(records, `${activeTab}-export`);
  };

  const openCreateModal = (type) => {
    setEditing({ type: null, item: null });
    setForms((prev) => ({ ...prev, [type]: initialForms[type] }));
    setActiveModal(type);
  };

  const openEditModal = (type, item) => {
    setEditing({ type, item });
    setForms((prev) => ({ ...prev, [type]: { ...item } }));
    setActiveModal(type);
  };

  const fetchInsights = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api('/api/insights', {
        method: 'POST',
        body: JSON.stringify({ materials: data.materials, production: data.production, sales: data.sales })
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

  const handleImportCSV = async (type, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await importFromCSV(file);
      await Promise.all(rows.map((row) => api(endpointMap[type], { method: 'POST', body: JSON.stringify({ company_id: company.id, ...row }) })));
      notification.success(`Imported ${rows.length} row(s) to ${type}.`);
      await loadAllData();
    } catch (err) {
      notification.error(`Import failed: ${err.message}`);
    } finally {
      event.target.value = '';
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

  const filteredData = useMemo(() => {
    const list = data[activeTab] || [];
    return list.filter((item) => {
      const query = (filters.searchText || '').toLowerCase();
      const asText = Object.values(item).join(' ').toLowerCase();
      const qty = Number(item.quantity ?? 0);
      const minOk = filters.minQuantity ? qty >= Number(filters.minQuantity) : true;
      const maxOk = filters.maxQuantity ? qty <= Number(filters.maxQuantity) : true;
      const dateValue = item.date ? new Date(item.date) : null;
      const startOk = filters.startDate && dateValue ? dateValue >= new Date(filters.startDate) : true;
      const endOk = filters.endDate && dateValue ? dateValue <= new Date(filters.endDate) : true;
      const searchOk = !query || asText.includes(query);
      return minOk && maxOk && startOk && endOk && searchOk;
    });
  }, [activeTab, data, filters]);

  const updateForm = (scope, key, value) => {
    setForms((prev) => ({ ...prev, [scope]: { ...prev[scope], [key]: value } }));
  };

  const toggleRow = (id) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleAllRows = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
      return;
    }
    setSelectedRows(filteredData.map((row) => row.id));
  };

  const renderModalContent = (type) => {
    const fieldsByType = {
      materials: ['name', 'quantity', 'cost_per_unit', 'unit'],
      production: ['product_name', 'quantity', 'cost', 'date'],
      sales: ['buyer_name', 'location', 'quantity', 'selling_price', 'date']
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {fieldsByType[type].map((field) => (
            <FormField
              key={field}
              label={fieldLabels[field] || field}
              value={forms[type][field] || ''}
              options={field === 'unit' ? materialUnits : undefined}
              type={field === 'date' ? 'date' : 'text'}
              onChange={(e) => updateForm(type, field, e.target.value)}
            />
          ))}
        </div>
        <button
          className="primary-btn rounded-lg px-4 py-2"
          onClick={() => (editing.type ? onUpdate() : onSubmit(type, endpointMap[type]))}
          disabled={loading}
        >
          {editing.type ? 'Save Changes' : `Add ${type.slice(0, -1)}`}
        </button>
      </div>
    );
  };

  if (isInitialLoading) {
    return <div className="min-h-screen bg-slate-950 p-8"><Skeleton rows={6} /></div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-[radial-gradient(circle_at_top,#164e63_0%,#111827_40%,#020617_100%)]">
      <NotificationToast items={notification.toasts} onDismiss={notification.dismiss} />
      <FormModal isOpen={Boolean(activeModal)} onClose={() => setActiveModal(null)} title={editing.type ? `Edit ${editing.type}` : `Add ${activeModal}`}>
        {activeModal ? renderModalContent(activeModal) : null}
      </FormModal>
      <div className="flex flex-col md:flex-row gap-4">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 space-y-4">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-5 shadow-2xl border border-cyan-100/60 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-rise-in">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-600">Smart Manufacturing Suite</p>
              <h1 className="text-2xl font-semibold text-slate-800">Welcome, {company.name}</h1>
              <p className="text-sm text-slate-500 mt-1">Monitor operations, revenue, and smart insights in one place.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="border border-slate-200 text-slate-600 rounded-lg px-3 py-2 text-sm" onClick={logout}>Logout</button>
            </div>
          </div>

          {!!error && <div className="bg-rose-500/15 text-rose-200 border border-rose-400/50 rounded-lg px-3 py-2 text-sm">{error}</div>}

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((card) => <EnhancedStatCard key={card.title} {...card} />)}
          </section>

          {['materials', 'production', 'sales'].includes(activeTab) && (
            <section className="bg-white/10 backdrop-blur rounded-2xl p-5 shadow-2xl border border-cyan-100/20 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-100 capitalize">{activeTab}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <button className="primary-btn rounded-lg px-3 py-2" onClick={() => openCreateModal(activeTab)}>+ Add</button>
                  <button className="rounded-lg border border-white/20 px-3 py-2 text-slate-100" onClick={() => exportToCSV(filteredData, `${activeTab}-all`)}>Export CSV</button>
                  <label className="rounded-lg border border-white/20 px-3 py-2 text-slate-100 cursor-pointer">
                    Import CSV
                    <input type="file" accept=".csv" className="hidden" onChange={(e) => handleImportCSV(activeTab, e)} />
                  </label>
                </div>
              </div>

              <FilterBar onFilter={setFilters} includeDate={activeTab !== 'materials'} includeQuantity />
              <BulkActions selectedRows={selectedRows} onDelete={onBulkDelete} onExport={onBulkExport} />

              <DataTable
                selectable
                selectedRows={selectedRows}
                onToggleRow={toggleRow}
                onToggleAll={toggleAllRows}
                columns={
                  activeTab === 'materials'
                    ? [
                        { key: 'name', label: 'Name', render: (row) => <span className="font-medium">{row.name}</span> },
                        { key: 'quantity', label: 'Quantity' },
                        { key: 'unit', label: 'Unit', render: (row) => <span className="uppercase text-xs tracking-wide text-cyan-200">{row.unit || 'kg'}</span> },
                        { key: 'cost_per_unit', label: 'Cost / Unit', render: (row) => `₹${row.cost_per_unit}` },
                        { key: 'status', label: 'Status', render: (row) => <StatusBadge quantity={row.quantity} /> },
                        { key: 'actions', label: 'Actions', render: (row) => <div className="flex gap-2"><button onClick={() => openEditModal('materials', row)} className="text-cyan-200">Edit</button><button onClick={() => onDelete('materials', row.id)} className="text-rose-200">Delete</button></div> }
                      ]
                    : activeTab === 'production'
                      ? [
                          { key: 'product_name', label: 'Product' },
                          { key: 'quantity', label: 'Qty' },
                          { key: 'cost', label: 'Cost', render: (row) => `₹${row.cost}` },
                          { key: 'date', label: 'Date' },
                          { key: 'actions', label: 'Actions', render: (row) => <div className="flex gap-2"><button onClick={() => openEditModal('production', row)} className="text-cyan-200">Edit</button><button onClick={() => onDelete('production', row.id)} className="text-rose-200">Delete</button></div> }
                        ]
                      : [
                          { key: 'buyer_name', label: 'Buyer' },
                          { key: 'location', label: 'Location' },
                          { key: 'quantity', label: 'Qty' },
                          { key: 'selling_price', label: 'Price', render: (row) => `₹${row.selling_price}` },
                          { key: 'date', label: 'Date' },
                          { key: 'actions', label: 'Actions', render: (row) => <div className="flex gap-2"><button onClick={() => openEditModal('sales', row)} className="text-cyan-200">Edit</button><button onClick={() => onDelete('sales', row.id)} className="text-rose-200">Delete</button></div> }
                        ]
                }
                data={filteredData}
                emptyTitle={`No ${activeTab} found`}
              />
            </section>
          )}

          {activeTab === 'analytics' && data.analytics && (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="Daily Sales Trend" change={5.2}><div className="h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={data.analytics.dailySales}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" /><XAxis dataKey="date" stroke="#cbd5e1" /><YAxis stroke="#cbd5e1" /><Tooltip /><Line type="monotone" dataKey="total" stroke="#22d3ee" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></div></ChartCard>
              <ChartCard title="Daily Production Cost" change={-2.1}><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.analytics.dailyCost}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" /><XAxis dataKey="date" stroke="#cbd5e1" /><YAxis stroke="#cbd5e1" /><Tooltip /><Bar dataKey="total" fill="#818cf8" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></ChartCard>
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
