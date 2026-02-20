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
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-6 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Register Company</h1>
        <input className="w-full border p-2 rounded" placeholder="Company Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="w-full border p-2 rounded" type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full border p-2 rounded" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="w-full bg-indigo-600 text-white p-2 rounded disabled:opacity-50" disabled={loading}>
          {loading ? 'Creating...' : 'Create Account'}
        </button>
        <p className="text-sm text-center">Already have account? <Link className="text-indigo-600" to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default RegisterPage;
