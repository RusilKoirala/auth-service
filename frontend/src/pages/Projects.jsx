import { useEffect, useState } from 'react';
import { projectAPI } from '../utils/api';
import { Eye, EyeOff, Copy, Loader2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApiKey, setShowApiKey] = useState({});
  const [copied, setCopied] = useState(null);
  const [creating, setCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectAPI.listUserProjects();
      setProjects(res.projects || []);
    } catch (err) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApiKey = (id) => {
    setShowApiKey((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (apiKey, id) => {
    navigator.clipboard.writeText(apiKey);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await projectAPI.createProject({ name: newProjectName });
      setNewProjectName('');
      await fetchProjects();
    } catch (err) {
      setError(err.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Your Projects</h1>
        {/* Create Project Form */}
        <form onSubmit={handleCreateProject} className="mb-8 flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="New project name"
            className="input-field flex-1"
            disabled={creating}
            maxLength={64}
          />
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
            disabled={creating || !newProjectName.trim()}
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>{creating ? 'Creating...' : 'Create Project'}</span>
          </button>
        </form>
        {error && <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>}
        {projects.length === 0 ? (
          <div className="card p-8 text-center text-muted-foreground">No projects found.</div>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <Link to={`/projects/${project._id}`} key={project._id} className="block group">
                <div className="card p-6 flex flex-col md:flex-row md:items-center md:justify-between group-hover:shadow-lg transition-all duration-200">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-200">{project.name}</h2>
                    <p className="text-xs text-muted-foreground mb-2">Created: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}</p>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-muted-foreground mr-2">API Key:</span>
                      <input
                        type={showApiKey[project._id] ? 'text' : 'password'}
                        value={project.apiKey}
                        readOnly
                        className="bg-transparent border-none text-xs font-mono text-foreground flex-1 focus:outline-none w-48"
                        style={{ minWidth: 0 }}
                      />
                      <button
                        type="button"
                        onClick={e => { e.preventDefault(); handleToggleApiKey(project._id); }}
                        className="ml-2 p-1 rounded hover:bg-muted/70"
                        aria-label={showApiKey[project._id] ? 'Hide API Key' : 'Show API Key'}
                      >
                        {showApiKey[project._id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={e => { e.preventDefault(); handleCopy(project.apiKey, project._id); }}
                        className="ml-2 p-1 rounded hover:bg-muted/70"
                        aria-label="Copy API Key"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {copied === project._id && <span className="ml-2 text-xs text-green-600">Copied!</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 