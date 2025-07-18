import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-2">
      <div className="bg-card/90 border border-border rounded-2xl shadow-lg max-w-2xl w-full py-16 px-6 md:px-10 mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Terms of Service</h1>
        <p className="mb-4 text-muted-foreground">This project is a personal/hobby open-source authentication service. By using this demo, you agree that:</p>
        <ul className="list-disc ml-6 text-muted-foreground space-y-2">
          <li>This site is for demonstration and educational purposes only.</li>
          <li>No guarantees are made about uptime, security, or data retention.</li>
          <li>If you self-host, you are responsible for your own users and data.</li>
          <li>For any issues, open an issue on <a href="https://github.com/rusilkoirala/auth-service" className="text-primary underline" target="_blank" rel="noopener noreferrer">GitHub</a>.</li>
        </ul>
      </div>
    </div>
  );
} 