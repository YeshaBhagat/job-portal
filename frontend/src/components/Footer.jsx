import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-display font-bold text-lg text-white">Hire<span className="text-blue-400">Hub</span></span>
            </div>
            <p className="text-sm leading-relaxed">Connecting talented professionals with companies that are shaping the future.</p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-3">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link to="/recruiter" className="hover:text-white transition-colors">Recruiter Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-6 text-sm text-center text-slate-500">
          © {new Date().getFullYear()} HireHub. Built with React, Node.js & MongoDB.
        </div>
      </div>
    </footer>
  );
}
