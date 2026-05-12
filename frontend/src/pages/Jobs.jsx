import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import JobCard from '../components/JobCard';

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];
const CATEGORIES = ['Technology', 'Marketing', 'Finance', 'Design', 'Sales', 'HR', 'Operations', 'Other'];
const EXPERIENCE = ['Fresher', '1-2 years', '2-5 years', '5+ years'];

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    experience: searchParams.get('experience') || '',
  });

  const fetchJobs = async (currentFilters = filters, currentPage = page) => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 9, ...currentFilters };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const res = await axios.get('/api/jobs', { params });
      setJobs(res.data.jobs || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs(filters, 1);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => v && (params[k] = v));
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPage(1);
    fetchJobs(newFilters, 1);
  };

  const clearFilters = () => {
    const cleared = { search: '', location: '', type: '', category: '', experience: '' };
    setFilters(cleared);
    setPage(1);
    fetchJobs(cleared, 1);
    setSearchParams({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl text-slate-900">Browse Jobs</h1>
        <p className="text-slate-500 text-sm mt-1">{total} job{total !== 1 ? 's' : ''} found</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search job title, skills, company..."
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
          className="input-field flex-grow"
        />
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={e => setFilters({ ...filters, location: e.target.value })}
          className="input-field w-36 hidden sm:block"
        />
        <button type="submit" className="btn-primary whitespace-nowrap">Search</button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${showFilters || activeFilterCount > 0 ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          Filters {activeFilterCount > 0 && <span className="bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
        </button>
      </form>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Job Type</label>
              <div className="flex flex-wrap gap-2">
                {JOB_TYPES.map(t => (
                  <button key={t} onClick={() => handleFilterChange('type', filters.type === t ? '' : t)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${filters.type === t ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-600 hover:border-blue-300'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</label>
              <select value={filters.category} onChange={e => handleFilterChange('category', e.target.value)} className="input-field text-sm">
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Experience</label>
              <select value={filters.experience} onChange={e => handleFilterChange('experience', e.target.value)} className="input-field text-sm">
                <option value="">Any Experience</option>
                {EXPERIENCE.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
          </div>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="mt-4 text-sm text-red-500 hover:text-red-700 font-medium">
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Job grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-200" />
                <div className="flex-grow space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map(job => <JobCard key={job._id} job={job} />)}
          </div>
          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setPage(i + 1); fetchJobs(filters, i + 1); }}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <svg className="w-16 h-16 mx-auto mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <h3 className="font-display font-semibold text-lg text-slate-700 mb-2">No jobs found</h3>
          <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
          <button onClick={clearFilters} className="mt-4 btn-outline text-sm py-2 px-4">Clear filters</button>
        </div>
      )}
    </div>
  );
}
