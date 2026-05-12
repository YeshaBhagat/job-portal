import React from 'react';
import { Link } from 'react-router-dom';

const typeColors = {
  'Full-time': 'badge-blue',
  'Part-time': 'badge-yellow',
  'Internship': 'badge-purple',
  'Contract': 'badge-green',
  'Remote': 'badge-green',
};

const formatSalary = (min, max, currency = 'INR') => {
  if (!min && !max) return 'Salary not disclosed';
  const fmt = (n) => (currency === 'INR' ? `₹${(n / 1000).toFixed(0)}K` : `$${(n / 1000).toFixed(0)}K`);
  if (min && max) return `${fmt(min)} – ${fmt(max)} / yr`;
  if (max) return `Up to ${fmt(max)} / yr`;
  return `From ${fmt(min)} / yr`;
};

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

export default function JobCard({ job }) {
  return (
    <Link to={`/jobs/${job._id}`} className="card p-5 block group">
      <div className="flex items-start justify-between gap-3">
        {/* Company avatar */}
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold font-display text-lg group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white transition-all duration-200">
          {job.company?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display font-semibold text-slate-900 text-base leading-tight group-hover:text-blue-600 transition-colors">{job.title}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{job.company}</p>
            </div>
            <span className={`${typeColors[job.type] || 'badge-blue'} flex-shrink-0`}>{job.type}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {job.location}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              {job.experience}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="badge bg-slate-50 text-slate-600 text-xs">{job.category}</span>
          {job.applicantsCount > 0 && (
            <span className="text-xs text-slate-400">{job.applicantsCount} applicant{job.applicantsCount !== 1 ? 's' : ''}</span>
          )}
        </div>
        <span className="text-xs text-slate-400">{timeAgo(job.createdAt)}</span>
      </div>
    </Link>
  );
}
