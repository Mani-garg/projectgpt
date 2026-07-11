import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="orb orb-purple" />
      <div className="orb orb-emerald" />
      <div className="glass-card w-full max-w-md p-8 space-y-5 animate-rise-in">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-indigo-200">Textile ERP</p>
          <h1 className="text-3xl font-semibold mt-2">Create your workspace</h1>
          <p className="text-sm text-slate-300 mt-1">Set up your company and start tracking performance.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="form-input" placeholder="Company Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="form-input" type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="form-input" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p className="text-rose-300 text-sm">{error}</p>}
          <button className="primary-btn w-full disabled:opacity-50" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="text-sm text-center text-slate-300">Already have account? <Link className="text-indigo-300 hover:text-indigo-200" to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
