import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import JobCard from '../components/JobCard';

const stats = [
  { label: 'Jobs Posted', value: '2,400+' },
  { label: 'Companies', value: '300+' },
  { label: 'Hired This Month', value: '850+' },
  { label: 'Job Seekers', value: '12K+' },
];

const categories = [
  { name: 'Technology', icon: '💻', color: 'from-blue-500 to-blue-600' },
  { name: 'Marketing', icon: '📢', color: 'from-pink-500 to-rose-500' },
  { name: 'Finance', icon: '💰', color: 'from-green-500 to-emerald-600' },
  { name: 'Design', icon: '🎨', color: 'from-purple-500 to-violet-600' },
  { name: 'Sales', icon: '🤝', color: 'from-orange-500 to-amber-500' },
  { name: 'HR', icon: '👥', color: 'from-teal-500 to-cyan-600' },
];

export default function Home() {
  const [recentJobs, setRecentJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/jobs?limit=6')
      .then(res => setRecentJobs(res.data.jobs || []))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-400 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-purple-400 rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm mb-6 animate-fade-in-up stagger-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>1,200+ new jobs this week</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold leading-tight mb-5 animate-fade-in-up stagger-2">
            Find Your <span className="text-gradient">Dream Job</span><br />Today
          </h1>
          <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto animate-fade-in-up stagger-3">
            Browse thousands of opportunities from top companies. Your next career move starts here.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="glass rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto animate-fade-in-up stagger-4">
            <input
              type="text"
              placeholder="Job title, skills, or company..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-grow bg-transparent text-white placeholder-blue-200 px-4 py-2.5 text-sm outline-none"
            />
            <div className="w-px bg-white/20 hidden sm:block" />
            <input
              type="text"
              placeholder="Location..."
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="bg-transparent text-white placeholder-blue-200 px-4 py-2.5 text-sm outline-none sm:w-36"
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="font-display font-bold text-2xl text-blue-600">{s.value}</div>
              <div className="text-sm text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display font-bold text-2xl text-slate-900">Browse by Category</h2>
          <Link to="/jobs" className="text-blue-600 text-sm font-medium hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.name}
              to={`/jobs?category=${cat.name}`}
              className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-md transition-all duration-200 text-center"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                {cat.icon}
              </div>
              <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="bg-slate-50 py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display font-bold text-2xl text-slate-900">Latest Opportunities</h2>
            <Link to="/jobs" className="text-blue-600 text-sm font-medium hover:underline">See all jobs →</Link>
          </div>
          {recentJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentJobs.map(job => <JobCard key={job._id} job={job} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
              <p>No jobs yet. Be the first to post one!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-600 rounded-2xl p-8 text-white">
            <h3 className="font-display font-bold text-xl mb-2">Looking for a job?</h3>
            <p className="text-blue-100 text-sm mb-5">Create a free profile and apply to hundreds of jobs today.</p>
            <Link to="/register" className="inline-block bg-white text-blue-600 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors">
              Sign Up Free →
            </Link>
          </div>
          <div className="bg-dark-900 rounded-2xl p-8 text-white">
            <h3 className="font-display font-bold text-xl mb-2">Hiring talent?</h3>
            <p className="text-slate-300 text-sm mb-5">Post jobs for free and reach thousands of qualified candidates.</p>
            <Link to="/register" state={{ defaultRole: 'recruiter' }} className="inline-block bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-500 transition-colors">
              Post a Job →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
