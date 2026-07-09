import React from 'react';
import Dashboard from './Dashboard.jsx';
import AuthorDashboard from './AuthorDashboard.jsx';

export default function ReaderAuthorDashboard() {
  return (
    <div className="flex flex-col space-y-8">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-bold px-6 pt-4 text-text">Reader Dashboard</h2>
        <Dashboard />
      </div>
      <div>
        <h2 className="text-2xl font-bold px-6 pt-4 text-text">Author Hub</h2>
        <AuthorDashboard />
      </div>
    </div>
  );
}
