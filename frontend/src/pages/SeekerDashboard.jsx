import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const statusConfig = {
  Pending:     { color: 'badge-yellow', icon: '⏳' },
  Reviewed:    { color: 'badge-blue',   icon: '👁️' },
  Shortlisted: { color: 'badge-green',  icon: '⭐' },
  Rejected:    { color: 'badge-red',    icon: '✕'  },
  Hired:       { color: 'badge-green',  icon: '🎉' },
};

export default function SeekerDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState('');

  useEffect(() => {
    axios.get('/api/applications/my')
      .then(res => setApplications(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const withdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    setWithdrawing(id);
    try {
      await axios.delete(`/api/applications/${id}`);
      setApplications(prev => prev.filter(a => a._id !== id));
    } catch {}
    setWithdrawing('');
  };

  const counts = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'Pending').length,
    shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    hired: applications.filter(a => a.status === 'Hired').length,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">My Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, {user?.name}</p>
        </div>
        <Link to="/jobs" className="btn-primary text-sm">Browse More Jobs</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Applied', value: counts.total, color: 'bg-blue-50 text-blue-700' },
          { label: 'Pending', value: counts.pending, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Shortlisted', value: counts.shortlisted, color: 'bg-green-50 text-green-700' },
          { label: 'Hired', value: counts.hired, color: 'bg-emerald-50 text-emerald-700' },
        ].map(stat => (
          <div key={stat.label} className={`card p-4 ${stat.color}`}>
            <div className="font-display font-bold text-3xl">{stat.value}</div>
            <div className="text-sm font-medium mt-0.5 opacity-80">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Applications list */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-display font-semibold text-slate-900">My Applications</h2>
          <span className="text-sm text-slate-400">{applications.length} total</span>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                <div className="flex-grow space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 px-4">
            <svg className="w-14 h-14 mx-auto mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <h3 className="font-display font-semibold text-slate-700 mb-2">No applications yet</h3>
            <p className="text-slate-400 text-sm mb-4">Start browsing jobs and apply!</p>
            <Link to="/jobs" className="btn-primary text-sm py-2 px-4">Browse Jobs</Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {applications.map(app => (
              <div key={app._id} className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold font-display flex-shrink-0">
                  {app.job?.company?.charAt(0) || '?'}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link to={`/jobs/${app.job?._id}`} className="font-medium text-slate-900 hover:text-blue-600 text-sm">
                      {app.job?.title || 'Job Removed'}
                    </Link>
                    <span className={statusConfig[app.status]?.color || 'badge-blue'}>
                      {statusConfig[app.status]?.icon} {app.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {app.job?.company} · {app.job?.location} · Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  {app.recruiterNote && (
                    <p className="text-xs text-slate-600 bg-slate-100 rounded-lg px-2 py-1 mt-1.5 inline-block">💬 {app.recruiterNote}</p>
                  )}
                </div>
                {app.status === 'Pending' && (
                  <button
                    onClick={() => withdraw(app._id)}
                    disabled={withdrawing === app._id}
                    className="text-xs text-red-400 hover:text-red-600 font-medium flex-shrink-0"
                  >
                    {withdrawing === app._id ? '...' : 'Withdraw'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
