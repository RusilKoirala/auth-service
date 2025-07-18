import React, { useEffect, useState } from 'react';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const fetchProjectStats = async (projectId) => {
  const token = localStorage.getItem('authToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const endpoints = [
    'users-created',
    'users-deleted',
    'total-users',
    'active-sessions',
  ];

  const results = await Promise.all(
    endpoints.map(async endpoint => {
      const url = `${API_BASE_URL}/projects/${projectId}/stats/${endpoint}`;
      try {
        const res = await fetch(url, { headers });
        if (!res.ok) {
          const errorText = await res.text();
          console.error(`[Analytics] Fetch failed for ${endpoint}:`, {
            url,
            status: res.status,
            response: errorText,
          });
          return 0;
        }
        try {
          const data = await res.clone().json();
          if (typeof data.count !== 'number') {
            throw new Error(`Invalid JSON response for ${endpoint}: ${JSON.stringify(data)}`);
          }
          return data.count;
        } catch (jsonErr) {
          const text = await res.text();
          console.error(`[Analytics] JSON parse error for ${endpoint}:`, {
            url,
            status: res.status,
            response: text,
            error: jsonErr,
          });
          return 0;
        }
      } catch (err) {
        console.error(`[Analytics] Network or fetch error for ${endpoint}:`, {
          url,
          error: err,
        });
        return 0;
      }
    })
  );

  return {
    usersCreated: results[0],
    usersDeleted: results[1],
    totalUsers: results[2],
    activeSessions: results[3],
  };
};

export function ProjectAnalyticsDashboard({ projectId, canView }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProjectStats(projectId);
      setStats(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canView) fetchStats();
    // eslint-disable-next-line
  }, [projectId, canView]);

  if (!canView) {
    return (
      <div className="card p-6 mb-6 text-center text-muted-foreground">
        You do not have permission to view analytics for this project.
      </div>
    );
  }

  return (
    <div className="card p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">Project Analytics</h2>
        <button
          onClick={fetchStats}
          className="btn-secondary text-sm px-3 py-1 rounded"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {error && <div className="text-destructive mb-4">{error}</div>}
      {loading && !stats ? (
        <div className="text-muted-foreground">Loading analytics...</div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-muted-foreground">Total Users Created</div>
            <div className="text-2xl font-bold text-foreground">{stats.usersCreated}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total Users Deleted</div>
            <div className="text-2xl font-bold text-foreground">{stats.usersDeleted}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total Registered Users</div>
            <div className="text-2xl font-bold text-foreground">{stats.totalUsers}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Active Sessions</div>
            <div className="text-2xl font-bold text-foreground">{stats.activeSessions}</div>
          </div>
        </div>
      ) : null}
      <div className="mt-4 text-xs text-muted-foreground text-right">
        Last updated: {lastUpdated ? lastUpdated.toLocaleString() : '—'}
      </div>
    </div>
  );
} 