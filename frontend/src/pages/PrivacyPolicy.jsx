import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-2">
      <div className="bg-card/90 border border-border rounded-2xl shadow-lg max-w-2xl w-full py-16 px-6 md:px-10 mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Privacy Policy</h1>
        <p className="mb-4 text-muted-foreground">This project is a personal/hobby open-source authentication service. We do not collect, store, or share any personal data from users of this demo site. If you self-host, you are responsible for your own data and privacy practices.</p>
        <ul className="list-disc ml-6 text-muted-foreground space-y-2">
          <li>No analytics or tracking is used on this site.</li>
          <li>No user data is shared with third parties.</li>
          <li>All authentication and user data is managed by you if you self-host.</li>
          <li>For questions, open an issue on <a href="https://github.com/rusilkoirala/auth-service" className="text-primary underline" target="_blank" rel="noopener noreferrer">GitHub</a>.</li>
        </ul>
      </div>
    </div>
  );
} 