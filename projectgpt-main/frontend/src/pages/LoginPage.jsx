import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      login(response.company, response.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="orb orb-indigo" />
      <div className="orb orb-cyan" />
      <div className="glass-card w-full max-w-md p-8 space-y-5 animate-rise-in">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-indigo-200">Textile ERP</p>
          <h1 className="text-3xl font-semibold mt-2">Welcome back</h1>
          <p className="text-sm text-slate-300 mt-1">Sign in to continue managing your operations.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="form-input" type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="form-input" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p className="text-rose-300 text-sm">{error}</p>}
          <button className="primary-btn w-full disabled:opacity-50" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="text-sm text-center text-slate-300">No account? <Link className="text-indigo-300 hover:text-indigo-200" to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
