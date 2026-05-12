import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-display font-bold text-xl text-slate-900">Hire<span className="text-blue-600">Hub</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>Home</Link>
            <Link to="/jobs" className={`text-sm font-medium transition-colors ${isActive('/jobs') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>Browse Jobs</Link>

            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'seeker' && (
                  <Link to="/dashboard" className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>My Applications</Link>
                )}
                {user.role === 'recruiter' && (
                  <Link to="/recruiter" className={`text-sm font-medium transition-colors ${isActive('/recruiter') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>Dashboard</Link>
                )}
                <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 text-sm font-semibold">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.name.split(' ')[0]}</span>
                  <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium ml-1">Logout</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 flex flex-col gap-2 animate-fade-in">
            <Link to="/" onClick={() => setMenuOpen(false)} className="py-2 px-2 text-sm font-medium text-slate-700 hover:text-blue-600 rounded-lg">Home</Link>
            <Link to="/jobs" onClick={() => setMenuOpen(false)} className="py-2 px-2 text-sm font-medium text-slate-700 hover:text-blue-600 rounded-lg">Browse Jobs</Link>
            {user ? (
              <>
                {user.role === 'seeker' && <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="py-2 px-2 text-sm font-medium text-slate-700">My Applications</Link>}
                {user.role === 'recruiter' && <Link to="/recruiter" onClick={() => setMenuOpen(false)} className="py-2 px-2 text-sm font-medium text-slate-700">Recruiter Dashboard</Link>}
                <button onClick={handleLogout} className="py-2 px-2 text-sm font-medium text-red-500 text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="py-2 px-2 text-sm font-medium text-slate-700">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm text-center">Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
