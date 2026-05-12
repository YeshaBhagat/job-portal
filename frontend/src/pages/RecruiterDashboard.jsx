import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];
const CATEGORIES = ['Technology', 'Marketing', 'Finance', 'Design', 'Sales', 'HR', 'Operations', 'Other'];
const EXPERIENCES = ['Fresher', '1-2 years', '2-5 years', '5+ years'];
const STATUS_OPTIONS = ['Pending', 'Reviewed', 'Shortlisted', 'Rejected', 'Hired'];
const statusColors = { Pending: 'badge-yellow', Reviewed: 'badge-blue', Shortlisted: 'badge-green', Rejected: 'badge-red', Hired: 'badge-green' };

const emptyJob = { title: '', company: '', location: '', type: 'Full-time', category: 'Technology', description: '', requirements: '', responsibilities: '', salaryMin: '', salaryMax: '', experience: 'Fresher', deadline: '' };

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('jobs'); // 'jobs' | 'post' | 'applications'
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [form, setForm] = useState({ ...emptyJob, company: user?.company || '' });
  const [loading, setLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [appsLoading, setAppsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    setJobsLoading(true);
    try {
      const res = await axios.get('/api/jobs/recruiter/myjobs');
      setJobs(res.data || []);
    } catch {} finally { setJobsLoading(false); }
  };

  const fetchApplications = async (job) => {
    setSelectedJob(job);
    setTab('applications');
    setAppsLoading(true);
    try {
      const res = await axios.get(`/api/applications/job/${job._id}`);
      setApplications(res.data || []);
    } catch {} finally { setAppsLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const payload = {
        ...form,
        requirements: form.requirements.split('\n').filter(Boolean),
        responsibilities: form.responsibilities.split('\n').filter(Boolean),
        salaryMin: Number(form.salaryMin) || 0,
        salaryMax: Number(form.salaryMax) || 0,
      };
      if (editingJob) {
        await axios.put(`/api/jobs/${editingJob._id}`, payload);
        setSuccess('Job updated successfully!');
      } else {
        await axios.post('/api/jobs', payload);
        setSuccess('Job posted successfully! 🎉');
      }
      setForm({ ...emptyJob, company: user?.company || '' });
      setEditingJob(null);
      setTab('jobs');
      fetchMyJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job.');
    } finally { setLoading(false); }
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this job? All applications will be lost.')) return;
    try {
      await axios.delete(`/api/jobs/${id}`);
      setJobs(prev => prev.filter(j => j._id !== id));
    } catch {}
  };

  const updateStatus = async (appId, status) => {
    try {
      const res = await axios.put(`/api/applications/${appId}/status`, { status });
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: res.data.status } : a));
    } catch {}
  };

  const startEdit = (job) => {
    setEditingJob(job);
    setForm({
      title: job.title, company: job.company, location: job.location,
      type: job.type, category: job.category, description: job.description,
      requirements: job.requirements.join('\n'),
      responsibilities: job.responsibilities.join('\n'),
      salaryMin: job.salaryMin, salaryMax: job.salaryMax,
      experience: job.experience, deadline: job.deadline?.split('T')[0] || '',
    });
    setTab('post');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">Recruiter Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">{user?.company || user?.name} · {jobs.length} jobs posted</p>
        </div>
        <button onClick={() => { setTab('post'); setEditingJob(null); setForm({ ...emptyJob, company: user?.company || '' }); setError(''); setSuccess(''); }}
          className="btn-primary text-sm">+ Post New Job</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Jobs Posted', value: jobs.length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Active Jobs', value: jobs.filter(j => j.isActive).length, color: 'bg-green-50 text-green-700' },
          { label: 'Total Applicants', value: jobs.reduce((s, j) => s + (j.applicantsCount || 0), 0), color: 'bg-purple-50 text-purple-700' },
        ].map(s => (
          <div key={s.label} className={`card p-4 ${s.color}`}>
            <div className="font-display font-bold text-3xl">{s.value}</div>
            <div className="text-sm font-medium mt-0.5 opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-slate-100 rounded-xl w-fit">
        {[
          { id: 'jobs', label: 'My Jobs' },
          { id: 'post', label: editingJob ? 'Edit Job' : 'Post Job' },
          ...(selectedJob ? [{ id: 'applications', label: `Applications (${applications.length})` }] : []),
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* My Jobs */}
      {tab === 'jobs' && (
        <div className="card overflow-hidden">
          {jobsLoading ? (
            <div className="p-6 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)}</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 mb-4">You haven't posted any jobs yet.</p>
              <button onClick={() => setTab('post')} className="btn-primary text-sm">Post Your First Job</button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {jobs.map(job => (
                <div key={job._id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 text-sm">{job.title}</span>
                      <span className={`badge text-xs ${job.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {job.isActive ? 'Active' : 'Closed'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{job.location} · {job.type} · {job.applicantsCount || 0} applicants</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => fetchApplications(job)} className="text-xs text-blue-600 font-medium hover:underline">
                      View Applications
                    </button>
                    <button onClick={() => startEdit(job)} className="text-xs text-slate-500 font-medium hover:text-slate-700">
                      Edit
                    </button>
                    <button onClick={() => deleteJob(job._id)} className="text-xs text-red-400 font-medium hover:text-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post / Edit Job */}
      {tab === 'post' && (
        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg text-slate-900 mb-6">{editingJob ? 'Edit Job' : 'Post a New Job'}</h2>
          {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm mb-5">{success}</div>}
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-5">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Title *</label>
                <input required placeholder="e.g. Frontend Developer" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name *</label>
                <input required placeholder="Your Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Location *</label>
                <input required placeholder="e.g. Bangalore, India" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-field">
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Experience</label>
                <select value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} className="input-field">
                  {EXPERIENCES.map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Min. Salary (₹/yr)</label>
                <input type="number" placeholder="e.g. 300000" value={form.salaryMin} onChange={e => setForm({ ...form, salaryMin: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Max. Salary (₹/yr)</label>
                <input type="number" placeholder="e.g. 600000" value={form.salaryMax} onChange={e => setForm({ ...form, salaryMax: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Application Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Description *</label>
              <textarea required rows={4} placeholder="Describe the role..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Requirements <span className="text-slate-400 font-normal">(one per line)</span></label>
              <textarea rows={3} placeholder={"B.Tech in Computer Science\n2+ years React experience"} value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} className="input-field resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Responsibilities <span className="text-slate-400 font-normal">(one per line)</span></label>
              <textarea rows={3} placeholder={"Build and maintain React components\nCollaborate with the design team"} value={form.responsibilities} onChange={e => setForm({ ...form, responsibilities: e.target.value })} className="input-field resize-none" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setTab('jobs'); setEditingJob(null); }} className="btn-outline">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-70">
                {loading ? 'Saving...' : editingJob ? 'Update Job' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Applications */}
      {tab === 'applications' && selectedJob && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h2 className="font-display font-semibold text-slate-900">Applications for: {selectedJob.title}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{applications.length} application{applications.length !== 1 ? 's' : ''}</p>
          </div>

          {appsLoading ? (
            <div className="p-6 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16 text-slate-400">No applications received yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {applications.map(app => (
                <div key={app._id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center text-purple-700 font-bold font-display flex-shrink-0">
                      {app.applicant?.name?.charAt(0)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-900 text-sm">{app.applicant?.name}</span>
                        <span className="text-slate-400 text-xs">·</span>
                        <span className="text-sm text-slate-500">{app.applicant?.email}</span>
                        <span className={statusColors[app.status] || 'badge-blue'}>{app.status}</span>
                      </div>

                      {app.applicant?.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {app.applicant.skills.slice(0, 5).map((s, i) => (
                            <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                        </div>
                      )}

                      {app.coverLetter && (
                        <p className="text-xs text-slate-600 mt-2 bg-slate-50 rounded-lg p-2 border-l-2 border-blue-300 line-clamp-2">
                          {app.coverLetter}
                        </p>
                      )}

                      {app.resumeLink && (
                        <a href={app.resumeLink} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mt-1.5 block">
                          📄 View Resume
                        </a>
                      )}

                      <p className="text-xs text-slate-400 mt-1.5">
                        Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Status update */}
                    <select
                      value={app.status}
                      onChange={e => updateStatus(app._id, e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 flex-shrink-0 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    >
                      {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
