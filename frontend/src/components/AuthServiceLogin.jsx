import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export function AuthServiceLogin({ apiKey, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const endpoint = isLogin ? '/project-users/login' : '/project-users/register';
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login/Register failed');
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        if (onSuccess) onSuccess(data.user || {});
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin((v) => !v);
    setFormData({ email: '', password: '', name: '' });
    setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="card p-8 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {isLogin ? 'Sign in to your project' : 'Create your project account'}
          </h2>
          <p className="text-muted-foreground">
            {isLogin
              ? 'Enter your email and password to sign in.'
              : 'Register a new user for this project.'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLogin}
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="input-field"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="input-field pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isSubmitting ? (isLogin ? 'Signing in...' : 'Registering...') : isLogin ? 'Sign In' : 'Register'}</span>
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={toggleMode}
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
            >
              {isLogin ? 'Register' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
      <div className="mt-4 text-center text-xs text-muted-foreground">
        Powered by <span className="font-semibold text-primary">AuthService</span>
      </div>
    </div>
  );
} 