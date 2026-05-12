import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const typeColors = { 'Full-time': 'badge-blue', 'Part-time': 'badge-yellow', 'Internship': 'badge-purple', 'Contract': 'badge-green', 'Remote': 'badge-green' };

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get(`/api/jobs/${id}`)
      .then(res => setJob(res.data))
      .catch(() => navigate('/jobs'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setApplying(true);
    setError('');
    try {
      await axios.post(`/api/applications/${id}`, { coverLetter, resumeLink });
      setApplied(true);
      setShowModal(false);
      setSuccess('🎉 Application submitted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-2/3 mb-4" />
      <div className="h-4 bg-slate-100 rounded w-1/3 mb-8" />
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-slate-100 rounded" />)}
      </div>
    </div>
  );

  if (!job) return null;

  const salaryText = job.salaryMin || job.salaryMax
    ? `₹${(job.salaryMin / 1000).toFixed(0)}K – ₹${(job.salaryMax / 1000).toFixed(0)}K / year`
    : 'Not disclosed';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-6 font-medium">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Jobs
      </Link>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm mb-6 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-2xl font-bold font-display text-blue-700 flex-shrink-0">
                {job.company?.charAt(0)}
              </div>
              <div className="flex-grow">
                <h1 className="font-display font-bold text-2xl text-slate-900">{job.title}</h1>
                <p className="text-slate-500 mt-0.5">{job.company} {job.postedBy?.companyWebsite && <a href={job.postedBy.companyWebsite} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-xs ml-1">↗ Website</a>}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className={typeColors[job.type] || 'badge-blue'}>{job.type}</span>
                  <span className="badge bg-slate-100 text-slate-600">{job.category}</span>
                  <span className="badge bg-slate-100 text-slate-600">{job.experience}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-100">
              {[
                { icon: '📍', label: 'Location', value: job.location },
                { icon: '💰', label: 'Salary', value: salaryText },
                { icon: '👥', label: 'Applicants', value: `${job.applicantsCount || 0}` },
                { icon: '📅', label: 'Posted', value: new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) },
              ].map(item => (
                <div key={item.label}>
                  <span className="text-xs text-slate-400 block">{item.label}</span>
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-1 mt-0.5">{item.icon} {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-lg text-slate-900 mb-4">Job Description</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {/* Requirements */}
          {job.requirements?.length > 0 && (
            <div className="card p-6">
              <h2 className="font-display font-semibold text-lg text-slate-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✓</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities?.length > 0 && (
            <div className="card p-6">
              <h2 className="font-display font-semibold text-lg text-slate-900 mb-4">Responsibilities</h2>
              <ul className="space-y-2">
                {job.responsibilities.map((res, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="text-blue-600 mt-0.5">•</span>
                    {res}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar - Apply */}
        <div className="space-y-4">
          <div className="card p-5 sticky top-24">
            {applied ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="font-display font-semibold text-slate-900">Applied!</h3>
                <p className="text-sm text-slate-500 mt-1">Your application was submitted</p>
                {user?.role === 'seeker' && <Link to="/dashboard" className="block mt-4 btn-outline text-sm text-center">View Applications</Link>}
              </div>
            ) : (
              <>
                <h3 className="font-display font-semibold text-slate-900 mb-4">Apply for this role</h3>
                {user?.role === 'seeker' ? (
                  <button onClick={() => setShowModal(true)} className="btn-primary w-full text-center">
                    Apply Now
                  </button>
                ) : user?.role === 'recruiter' ? (
                  <p className="text-sm text-slate-500 text-center">Recruiter accounts cannot apply for jobs.</p>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" className="btn-primary w-full text-center block">Login to Apply</Link>
                    <Link to="/register" className="btn-outline w-full text-center block text-sm">Create Account</Link>
                  </div>
                )}
                {job.deadline && (
                  <p className="text-xs text-slate-400 text-center mt-3">
                    Deadline: {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-xl text-slate-900">Apply for {job.title}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2.5 text-sm mb-4">{error}</div>}
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Cover Letter (optional)</label>
                <textarea
                  rows={4}
                  placeholder="Briefly describe why you're a great fit..."
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  className="input-field resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Resume Link (optional)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={resumeLink}
                  onChange={e => setResumeLink(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={applying} className="btn-primary flex-1 disabled:opacity-70">
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
