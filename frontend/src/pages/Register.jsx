import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const location = useLocation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: location.state?.defaultRole || 'seeker',
    company: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', form);
      login(res.data);
      navigate(res.data.role === 'recruiter' ? '/recruiter' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-2xl text-slate-900">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Join thousands of professionals on HireHub</p>
        </div>

        <div className="card p-7">
          {/* Role Toggle */}
          <div className="flex gap-2 mb-6 p-1.5 bg-slate-100 rounded-xl">
            {[
              { value: 'seeker', label: '🔍 Job Seeker' },
              { value: 'recruiter', label: '🏢 Recruiter' },
            ].map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => setForm({ ...form, role: r.value })}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${form.role === r.value ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input type="text" name="name" required placeholder="John Doe" value={form.name} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input type="email" name="email" required placeholder="you@example.com" value={form.email} onChange={handleChange} className="input-field" />
            </div>
            {form.role === 'recruiter' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name</label>
                <input type="text" name="company" placeholder="Your Company Pvt. Ltd." value={form.company} onChange={handleChange} className="input-field" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input type="password" name="password" required placeholder="Min. 6 characters" value={form.password} onChange={handleChange} className="input-field" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-70">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : `Create ${form.role === 'recruiter' ? 'Recruiter' : 'Seeker'} Account`}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
