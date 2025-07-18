import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export function ResendOtpButton({ email }) {
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [message, setMessage] = useState('');
  const [disabled, setDisabled] = useState(false);

  const handleResend = async () => {
    setStatus('sending');
    setMessage('');
    setDisabled(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage('OTP sent successfully.');
        setTimeout(() => setStatus('idle'), 2000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Failed to resend OTP.');
    }
    // Disable button for 2 minutes
    setTimeout(() => setDisabled(false), 2 * 60 * 1000);
  };

  return (
    <div className="mt-4">
      <button
        className="btn-secondary"
        onClick={handleResend}
        disabled={disabled || status === 'sending'}
      >
        {status === 'sending' ? 'Sending...' : 'Resend OTP'}
      </button>
      {message && (
        <div className={`mt-2 text-sm ${status === 'success' ? 'text-green-600' : 'text-destructive'}`}>
          {message}
        </div>
      )}
      {disabled && <div className="text-xs text-muted-foreground mt-1">Please wait before requesting again.</div>}
    </div>
  );
}

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      setStatus('verifying');
      setMessage('');
      try {
        const res = await fetch(`${API_BASE_URL}/auth/verify-email/${token}`);
        if (res.ok) {
          setStatus('success');
          setMessage('Your email has been verified. Redirecting to login...');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          const data = await res.json().catch(() => ({}));
          setStatus('error');
          setMessage(data.message || 'Verification failed. The link may be invalid or expired.');
        }
      } catch {
        setStatus('error');
        setMessage('Verification failed. Please try again.');
      }
    };
    if (token) verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="card p-8 text-center">
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Verifying Email</h2>
            <p className="text-muted-foreground">Please wait while we verify your email address...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Email Verified!</h2>
            <p className="text-muted-foreground">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Verification Failed</h2>
            <p className="text-destructive">{message}</p>
            <button onClick={() => navigate('/login')} className="btn-primary mt-4">Go to Login</button>
            {email && <ResendOtpButton email={email} />}
          </>
        )}
      </div>
    </div>
  );
} 