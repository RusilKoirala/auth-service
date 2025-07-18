import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { ResendOtpButton } from '../pages/VerifyEmail';

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldTouched, setFieldTouched] = useState({});
  
  const { login, register, error, clearError, isProjectMode } = useAuth();
  const navigate = useNavigate();

  // Real-time validation
  const validateField = (name, value) => {
    const errors = {};
    
    switch (name) {
      case 'email':
        if (!value) {
          errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (!isLogin) {
          // Only enforce complexity for registration, not login
          if (value.length < 6) {
            errors.password = 'Password must be at least 6 characters';
          } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            errors.password = 'Password must contain uppercase, lowercase, and number';
          }
        }
        break;
      case 'name':
        if (!isLogin && !value) {
          errors.name = 'Full name is required';
        } else if (!isLogin && value.length < 2) {
          errors.name = 'Name must be at least 2 characters';
        }
        break;
      default:
        break;
    }
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Mark field as touched
    setFieldTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field in real-time
    const fieldErrors = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: fieldErrors[name]
    }));
    
    // Clear auth error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFieldTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    const fieldErrors = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: fieldErrors[name]
    }));
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach(field => {
      if (!isLogin || field !== 'name') {
        const fieldErrors = validateField(field, formData[field]);
        if (fieldErrors[field]) {
          errors[field] = fieldErrors[field];
        }
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Mark all fields as touched to show errors
      setFieldTouched({
        email: true,
        password: true,
        name: !isLogin
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
      }
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the auth context
      console.error('Auth error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', name: '' });
    setValidationErrors({});
    setFieldTouched({});
    clearError();
  };

  const isFormValid = () => {
    const requiredFields = isLogin ? ['email', 'password'] : ['email', 'password', 'name'];
    return requiredFields.every(field => formData[field] && !validationErrors[field]);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Mode label */}
      <div className="mb-4 text-center">
        <span 
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground"
          role="status"
          aria-label={`Current mode: ${isProjectMode ? 'Project Embedded Auth' : 'Main Website Auth'}`}
        >
          {isProjectMode ? 'Project Embedded Auth' : 'Main Website Auth'}
        </span>
      </div>
      
      <div className="card p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-muted-foreground">
            {isLogin 
              ? 'Sign in to your account to continue' 
              : 'Get started with your free account'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Full Name <span className="text-destructive" aria-label="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required={!isLogin}
                className={`input-field ${
                  fieldTouched.name && validationErrors.name 
                    ? 'border-destructive focus:ring-destructive' 
                    : fieldTouched.name && formData.name && !validationErrors.name
                    ? 'border-green-500 focus:ring-green-500'
                    : ''
                }`}
                placeholder="Enter your full name"
                aria-describedby={fieldTouched.name && validationErrors.name ? 'name-error' : fieldTouched.name && formData.name && !validationErrors.name ? 'name-success' : undefined}
                aria-invalid={fieldTouched.name && validationErrors.name ? 'true' : 'false'}
              />
              {fieldTouched.name && validationErrors.name && (
                <div id="name-error" className="flex items-center space-x-1 mt-1 text-sm text-destructive" role="alert">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{validationErrors.name}</span>
                </div>
              )}
              {fieldTouched.name && formData.name && !validationErrors.name && (
                <div id="name-success" className="flex items-center space-x-1 mt-1 text-sm text-green-600" role="status">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Name looks good</span>
                </div>
              )}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email Address <span className="text-destructive" aria-label="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
              className={`input-field ${
                fieldTouched.email && validationErrors.email 
                  ? 'border-destructive focus:ring-destructive' 
                  : fieldTouched.email && formData.email && !validationErrors.email
                  ? 'border-green-500 focus:ring-green-500'
                  : ''
              }`}
              placeholder="Enter your email"
              aria-describedby={fieldTouched.email && validationErrors.email ? 'email-error' : fieldTouched.email && formData.email && !validationErrors.email ? 'email-success' : undefined}
              aria-invalid={fieldTouched.email && validationErrors.email ? 'true' : 'false'}
            />
            {fieldTouched.email && validationErrors.email && (
              <div id="email-error" className="flex items-center space-x-1 mt-1 text-sm text-destructive" role="alert">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{validationErrors.email}</span>
              </div>
            )}
            {fieldTouched.email && formData.email && !validationErrors.email && (
              <div id="email-success" className="flex items-center space-x-1 mt-1 text-sm text-green-600" role="status">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Email looks good</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password <span className="text-destructive" aria-label="required">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                className={`input-field pr-10 ${
                  fieldTouched.password && validationErrors.password 
                    ? 'border-destructive focus:ring-destructive' 
                    : fieldTouched.password && formData.password && !validationErrors.password
                    ? 'border-green-500 focus:ring-green-500'
                    : ''
                }`}
                placeholder="Enter your password"
                aria-describedby={fieldTouched.password && validationErrors.password ? 'password-error' : fieldTouched.password && formData.password && !validationErrors.password ? 'password-success' : undefined}
                aria-invalid={fieldTouched.password && validationErrors.password ? 'true' : 'false'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring rounded p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldTouched.password && validationErrors.password && (
              <div id="password-error" className="flex items-center space-x-1 mt-1 text-sm text-destructive" role="alert">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{validationErrors.password}</span>
              </div>
            )}
            {fieldTouched.password && formData.password && !validationErrors.password && (
              <div id="password-success" className="flex items-center space-x-1 mt-1 text-sm text-green-600" role="status">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Password meets requirements</span>
              </div>
            )}
          </div>

          {error && (
            <div 
              className="p-3 rounded-lg bg-destructive/10 border border-destructive/20"
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
              {/* Show ResendOtpButton if error is about email verification */}
              {error && error.toLowerCase().includes('verify your email') && formData.email && (
                <div className="mt-2">
                  <ResendOtpButton email={formData.email} />
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !isFormValid()}
            className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            aria-describedby={isSubmitting ? 'submitting-status' : undefined}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isSubmitting ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
          </button>
          
          {isSubmitting && (
            <div id="submitting-status" className="sr-only" aria-live="polite">
              Processing your request, please wait...
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={toggleMode}
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded px-1"
              aria-label={`Switch to ${isLogin ? 'sign up' : 'sign in'} mode`}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}; 