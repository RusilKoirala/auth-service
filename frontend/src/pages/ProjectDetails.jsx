import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Eye, EyeOff, Copy } from 'lucide-react';
import { projectAPI, adminAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ProjectAnalyticsDashboard } from '../components/ProjectAnalyticsDashboard';

export const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);
  const [showErrorToast, setShowErrorToast] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await projectAPI.getProjectById(id);
        setProject(res.project || null);
      } catch (err) {
        setProject(null);
        // Improved error handling for 401/403
        if (err.message && err.message.toLowerCase().includes('unauthorized')) {
          setError('You are not authorized. Please log in.');
          setShowErrorToast(true);
          setTimeout(() => {
            setShowErrorToast(false);
            window.location.href = '/login';
          }, 2000);
        } else if (err.message && err.message.toLowerCase().includes('forbidden')) {
          setError('You do not have permission to view this project.');
          setShowErrorToast(true);
          setTimeout(() => setShowErrorToast(false), 4000);
        } else {
          setError('Unable to fetch project details.');
          setShowErrorToast(true);
          setTimeout(() => setShowErrorToast(false), 4000);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProject().catch((err) => {
      setProject(null);
      setError('Unable to fetch project details.');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 4000);
    });
  }, [id]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!id || !project) return;
      try {
        setUsersLoading(true);
        setUsersError(null);
        const res = await adminAPI.listProjectUsers(id, project.apiKey);
        setUsers(res || []);
      } catch (err) {
        setUsersError('Failed to fetch users');
        setUsers([]);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, [id, project]);

  const handleCopy = () => {
    if (project?.apiKey) {
      navigator.clipboard.writeText(project.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Determine if user can view analytics (admin or owner)
  let canViewAnalytics = false;
  if (user && project) {
    const isOwner = project.owner && project.owner._id
      ? project.owner._id.toString() === user._id.toString()
      : project.owner && project.owner.toString() === user._id.toString();
    canViewAnalytics = user.isAdmin === true || isOwner;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="card p-8 text-center text-destructive">{error}</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="card p-8 text-center text-destructive">Project not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      {showErrorToast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-destructive text-destructive-foreground px-6 py-3 rounded-lg shadow-lg animate-bounce-in">
          <span>Unable to fetch project details. Please check the project ID or try again later.</span>
        </div>
      )}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Project: {project.name}</h1>
        <div className="mb-2 text-muted-foreground text-sm">
          Owner: {project.user?.name || project.user?.email || 'Unknown'}
        </div>
        <div className="card p-6 mb-8">
          <div className="mb-4">
            <span className="text-sm font-medium text-muted-foreground mr-2">API Key:</span>
            <input
              type={showApiKey ? 'text' : 'password'}
              value={project.apiKey}
              readOnly
              className="bg-transparent border-none text-xs font-mono text-foreground focus:outline-none w-48"
              style={{ minWidth: 0 }}
            />
            <button
              type="button"
              onClick={() => setShowApiKey(v => !v)}
              className="ml-2 p-1 rounded hover:bg-muted/70"
              aria-label={showApiKey ? 'Hide API Key' : 'Show API Key'}
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="ml-2 p-1 rounded hover:bg-muted/70"
              aria-label="Copy API Key"
            >
              <Copy className="w-4 h-4" />
            </button>
            {copied && <span className="ml-2 text-xs text-green-600">Copied!</span>}
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Created:</span>
            <span className="ml-2 text-foreground">{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
        {/* Analytics Dashboard */}
        <ProjectAnalyticsDashboard projectId={project._id} canView={canViewAnalytics} />
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Project Users</h2>
          {usersLoading ? (
            <div className="text-muted-foreground">Loading users...</div>
          ) : usersError ? (
            <div className="text-destructive">{usersError}</div>
          ) : users.length === 0 ? (
            <div className="text-muted-foreground">No users found for this project.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-2 text-muted-foreground font-medium">User</th>
                    <th className="text-left py-2 px-2 text-muted-foreground font-medium">Email</th>
                    <th className="text-left py-2 px-2 text-muted-foreground font-medium">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                      <td className="py-2 px-2 text-foreground flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold uppercase">
                          {user.name ? user.name[0] : user.email[0]}
                        </span>
                        <span>{user.name || '-'}</span>
                      </td>
                      <td className="py-2 px-2 text-foreground font-mono">{user.email}</td>
                      <td className="py-2 px-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 