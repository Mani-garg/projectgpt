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
      login(response.company);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-6 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Company Login</h1>
        <input className="w-full border p-2 rounded" type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full border p-2 rounded" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="w-full bg-indigo-600 text-white p-2 rounded disabled:opacity-50" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <p className="text-sm text-center">No account? <Link className="text-indigo-600" to="/register">Register</Link></p>
      </form>
    </div>
  );
};

export default LoginPage;
