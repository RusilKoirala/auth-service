import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Shield, User, Calendar, Activity, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { projectAPI } from '../utils/api';

export const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjectsLoading(true);
        const res = await projectAPI.listUserProjects();
        setProjects(res.projects || []);
      } catch (err) {
        setProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Show loading state
  if (loading || projectsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  const firstProject = projects[0];
  const projectName = firstProject?.name || 'No project';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user.name || user.email}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Profile</h2>
                  <p className="text-sm text-muted-foreground">Your account information</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-foreground">{user.name || 'Not provided'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground">{user.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User ID</label>
                  <p className="text-foreground font-mono text-sm">{user._id || user.id}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Project</label>
                  <p className="text-foreground">{projectName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity and Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Activity className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Login</p>
                    <p className="text-lg font-semibold text-foreground">Today</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Calendar className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="text-lg font-semibold text-foreground">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <Shield className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-lg font-semibold text-foreground">Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">Successfully logged in</p>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">Profile updated</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">Account created</p>
                    <p className="text-xs text-muted-foreground">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}; 