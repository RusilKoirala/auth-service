import { Link } from 'react-router-dom';
import { Shield, Zap, Lock, Users, ArrowRight, Check, Mail, BarChart2, UserCheck, X as XIcon, Minus } from 'lucide-react';
import ShieldLogo from '../assets/shield-logo.svg';
import { useEffect, useRef, useState } from 'react';

const codeExample = `// Register a user
fetch('/api/project-users/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your_api_key_here',
  },
  body: JSON.stringify({
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'securepassword123',
  })
});`;

export const Home = () => {
  const headlineRef = useRef(null);
  const btnsRef = useRef(null);

  useEffect(() => {
    // Animate headline and buttons on mount
    if (headlineRef.current) {
      headlineRef.current.classList.add('animate-slide-up');
    }
    if (btnsRef.current) {
      setTimeout(() => btnsRef.current.classList.add('animate-fade-in'), 300);
    }
  }, []);

  // New: FAQ accordion state
  const [openFaq, setOpenFaq] = useState(null);

  // FAQ data
  const faqs = [
    {
      q: 'Is AuthService really open-source?',
      a: 'Yes! You can self-host, audit, and extend the code as you wish.'
    },
    {
      q: 'Can I use my own SMTP provider?',
      a: 'Absolutely. Just set your SMTP credentials in the backend .env file.'
    },
    {
      q: 'Does it support project isolation?',
      a: 'Yes, each project has its own user base, API key, and analytics.'
    },
    {
      q: 'How do I contribute or get support?',
      a: 'Open an issue or pull request on our GitHub repository.'
    },
    {
      q: 'Is there a dark mode?',
      a: 'Yes, toggle it in the navbar for a comfortable experience day or night.'
    },
  ];

  // Feature grid data
  const features = [
    {
      icon: <Shield className="w-7 h-7 text-primary" />,
      title: 'Project-Scoped User Management',
      desc: 'Each project has its own isolated user base, API key, and analytics.'
    },
    {
      icon: <Mail className="w-7 h-7 text-primary" />,
      title: 'Email Verification',
      desc: 'Secure signups with built-in email verification and easy resend.'
    },
    {
      icon: <UserCheck className="w-7 h-7 text-primary" />,
      title: 'Admin Dashboard',
      desc: 'Admins can manage users, resend verification, and view analytics.'
    },
    {
      icon: <BarChart2 className="w-7 h-7 text-primary" />,
      title: 'Analytics',
      desc: 'Track user growth, active sessions, and more for each project.'
    },
    {
      icon: <Zap className="w-7 h-7 text-primary" />,
      title: 'API-First Design',
      desc: 'Simple, RESTful endpoints for easy integration in any stack.'
    },
    {
      icon: <Lock className="w-7 h-7 text-primary" />,
      title: 'JWT Security',
      desc: 'Industry-standard JWT tokens for secure, stateless authentication.'
    },
    {
      icon: <Check className="w-7 h-7 text-primary" />,
      title: 'Open Source',
      desc: 'No vendor lock-in. Audit, self-host, and extend as you wish.'
    },
    {
      icon: <Users className="w-7 h-7 text-primary" />,
      title: 'Modern UI/UX',
      desc: 'Beautiful, responsive, and dark-mode ready for devs and users.'
    },
  ];

  // Getting started steps
  const steps = [
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: 'Register Your Project',
      desc: 'Create a project and get your unique API key.'
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: 'Integrate the API',
      desc: 'Add AuthService endpoints to your app.'
    },
    {
      icon: <Mail className="w-6 h-6 text-primary" />,
      title: 'User Signup & Verification',
      desc: 'Users sign up and verify their email.'
    },
    {
      icon: <UserCheck className="w-6 h-6 text-primary" />,
      title: 'Login & Manage',
      desc: 'Verified users log in. Admins manage users and analytics.'
    },
  ];

  // Contributors data (static for now)
  const contributors = [
    { name: 'Rusil Koirala', avatar: 'https://avatars.githubusercontent.com/u/10229899?v=4', url: 'https://github.com/rusilkoirala' },
    // Add more contributors as needed
  ];

  // Comparison table data
  const comparisons = [
    { feature: 'Open Source', authService: 'yes', auth0: 'no', clerk: 'no' },
    { feature: 'Self-Hostable', authService: 'yes', auth0: 'no', clerk: 'no' },
    { feature: 'Project Isolation', authService: 'yes', auth0: 'yes', clerk: 'yes' },
    { feature: 'Email Verification', authService: 'yes', auth0: 'yes', clerk: 'yes' },
    { feature: 'Admin Dashboard', authService: 'yes', auth0: 'yes', clerk: 'yes' },
    { feature: 'Customizable UI', authService: 'yes', auth0: 'limited', clerk: 'limited' },
    { feature: 'No Vendor Lock-in', authService: 'yes', auth0: 'no', clerk: 'no' },
    { feature: 'Free Tier', authService: 'yes', auth0: 'limited', clerk: 'limited' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background px-2">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-br from-indigo-500/30 via-sky-400/20 to-blue-500/30 blur-2xl opacity-80" />
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-5xl mx-auto py-24 gap-10 md:gap-16">
        {/* Glassmorphism card */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-background/80 border border-border rounded-3xl shadow-2xl p-8 md:p-12 flex-1 flex flex-col items-center md:items-start text-center md:text-left max-w-xl">
          <img src={ShieldLogo} alt="Logo" className="w-16 h-16 mx-auto md:mx-0 mb-6 drop-shadow-lg animate-bounce-slow" />
          <h1 ref={headlineRef} className="text-4xl md:text-5xl font-extrabold mb-6 text-foreground opacity-0">
            Self-Hosted Authentication for Developers
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-slide-up delay-100">
            Build secure, customizable authentication into your apps with ease. Like Auth0 or Clerk — but open-source, fully under your control, and project-scoped.
          </p>
          <div ref={btnsRef} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start opacity-0">
            <Link to="/login" className="btn-primary text-lg px-8 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary transition-transform">Get Started</Link>
            <Link to="/docs" className="btn-secondary text-lg px-8 py-3 rounded-lg font-semibold hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary transition-transform">Read the Docs</Link>
          </div>
        </div>
        {/* Code example card (desktop only) */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="bg-muted/80 border border-border rounded-2xl shadow-lg p-6 w-full max-w-md animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-400" />
              <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
            </div>
            <pre className="text-xs md:text-sm font-mono text-foreground whitespace-pre-wrap leading-relaxed select-all">
              {codeExample}
            </pre>
          </div>
        </div>
      </div>

      {/* Problem & How It Works Section (2-column on desktop) */}
      <section className="relative z-10 w-full max-w-6xl mx-auto mt-20 mb-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Problem Card */}
        <div className="bg-card/80 border border-border rounded-2xl shadow-lg p-8 md:p-10 flex flex-col gap-6 items-start">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-7 h-7 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">The Problem We Solve</h2>
          </div>
          <p className="text-base md:text-lg text-muted-foreground">
            Most authentication solutions are either too complex, too expensive, or lock you into a vendor’s ecosystem. Open-source alternatives often lack polish, project isolation, or modern developer UX.
          </p>
          <p className="text-base md:text-lg text-muted-foreground">
            AuthService gives you a beautiful, self-hosted, project-scoped authentication system with email verification, analytics, and a modern UI—no vendor lock-in, no hidden costs, and full control for you and your team.
          </p>
        </div>
        {/* How It Works Card */}
        <div className="bg-card/80 border border-border rounded-2xl shadow-lg p-8 md:p-10 flex flex-col gap-6 items-start">
          <div className="flex items-center gap-3 mb-2">
            <BarChart2 className="w-7 h-7 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">How It Works</h2>
          </div>
          <ol className="space-y-4 text-base md:text-lg text-muted-foreground list-decimal list-inside">
            <li className="flex items-center gap-2"><Shield className="w-5 h-5 text-primary" />Register your project and get a unique API key.</li>
            <li className="flex items-center gap-2"><Zap className="w-5 h-5 text-primary" />Integrate the AuthService API into your app.</li>
            <li className="flex items-center gap-2"><Mail className="w-5 h-5 text-primary" />Users sign up and receive a verification email.</li>
            <li className="flex items-center gap-2"><UserCheck className="w-5 h-5 text-primary" />Verified users can log in and access your app securely.</li>
            <li className="flex items-center gap-2"><BarChart2 className="w-5 h-5 text-primary" />Admins can manage users, resend verification, and view analytics.</li>
          </ol>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="relative z-10 w-full max-w-6xl mx-auto mt-20 mb-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Features at a Glance</h2>
          <p className="text-lg text-muted-foreground">Everything you need for modern, project-scoped authentication.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-card/80 border border-border rounded-2xl shadow-md p-6 flex flex-col items-start gap-3 hover:shadow-xl transition">
              {f.icon}
              <h3 className="font-semibold text-lg text-foreground mt-2">{f.title}</h3>
              <p className="text-muted-foreground text-base">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Getting Started Timeline Section */}
      <section className="relative z-10 w-full max-w-4xl mx-auto mb-20">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Getting Started</h2>
          <p className="text-lg text-muted-foreground">From zero to secure authentication in minutes.</p>
        </div>
        <div className="relative flex flex-col md:flex-row items-center md:justify-between gap-8 md:gap-0 pt-8">
          {/* Timeline line (desktop only) */}
          <div className="hidden md:block absolute left-0 right-0 top-16 h-0.5 bg-gradient-to-r from-primary/30 to-sky-400/30 z-0" />
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative z-10 flex flex-col items-center md:w-1/4 text-center px-2 md:px-4 bg-transparent min-h-[120px]"
              style={{ minWidth: 0 }}
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border-2 border-primary mb-3 shrink-0">
                {step.icon}
              </div>
              <h4 className="font-semibold text-lg text-foreground mb-1 break-words leading-tight" style={{ wordBreak: 'break-word' }}>{step.title}</h4>
              <p className="text-muted-foreground text-base mb-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section - Accordion style */}
      <section className="relative z-10 w-full max-w-3xl mx-auto mb-24">
        <div className="bg-card/80 border border-border rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">Frequently Asked Questions</h2>
          <div className="divide-y divide-border">
            {faqs.map((faq, i) => (
              <div key={i} className="py-4">
                <button
                  className="w-full flex justify-between items-center text-left text-lg font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-panel-${i}`}
                >
                  <span>{faq.q}</span>
                  <ArrowRight className={`w-5 h-5 ml-2 transition-transform ${openFaq === i ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
                </button>
                <div
                  id={`faq-panel-${i}`}
                  className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
                  aria-hidden={openFaq !== i}
                >
                  <p className="text-muted-foreground text-base pl-1 pr-2 pt-2">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contributors/Community Section */}
      <section className="relative z-10 w-full max-w-3xl mx-auto mb-16">
        <div className="bg-card/80 border border-border rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Contributors & Community</h2>
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            {contributors.map((c, i) => (
              <a key={i} href={c.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                <img src={c.avatar} alt={c.name} className="w-14 h-14 rounded-full border-2 border-primary shadow group-hover:scale-105 transition" />
                <span className="mt-2 text-sm text-foreground font-medium group-hover:text-primary">{c.name}</span>
              </a>
            ))}
          </div>
          <p className="text-muted-foreground text-base">Want to contribute? <a href="https://github.com/rusilkoirala/auth-service" className="text-primary underline" target="_blank" rel="noopener noreferrer">Join us on GitHub</a>.</p>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="relative z-10 w-full max-w-4xl mx-auto mb-24">
        <div className="bg-card/80 border border-border rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">How We Compare</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-separate border-spacing-0 rounded-2xl overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-primary/10 to-sky-400/10 sticky top-0 z-10">
                  <th className="px-6 py-3 font-semibold text-foreground text-base text-left bg-background/80">Feature</th>
                  <th className="px-6 py-3 font-semibold text-primary text-base text-center bg-primary/5">AuthService</th>
                  <th className="px-6 py-3 font-semibold text-foreground text-base text-center bg-muted/50">Auth0</th>
                  <th className="px-6 py-3 font-semibold text-foreground text-base text-center bg-muted/50">Clerk</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr
                    key={i}
                    className={
                      'transition hover:bg-primary/5 group ' +
                      (i % 2 === 0 ? 'bg-background' : 'bg-muted/40')
                    }
                  >
                    <td className="px-6 py-4 text-foreground font-medium whitespace-nowrap border-b border-border group-hover:bg-primary/10 transition">{row.feature}</td>
                    <td className="px-6 py-4 text-center border-b border-border group-hover:bg-primary/10 transition">
                      {row.authService === 'yes' && <Check className="w-5 h-5 text-green-500 mx-auto" />}
                      {row.authService === 'no' && <XIcon className="w-5 h-5 text-destructive mx-auto" />}
                      {row.authService === 'limited' && <Minus className="w-5 h-5 text-yellow-500 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 text-center border-b border-border group-hover:bg-primary/10 transition">
                      {row.auth0 === 'yes' && <Check className="w-5 h-5 text-green-500 mx-auto" />}
                      {row.auth0 === 'no' && <XIcon className="w-5 h-5 text-destructive mx-auto" />}
                      {row.auth0 === 'limited' && <Minus className="w-5 h-5 text-yellow-500 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 text-center border-b border-border group-hover:bg-primary/10 transition">
                      {row.clerk === 'yes' && <Check className="w-5 h-5 text-green-500 mx-auto" />}
                      {row.clerk === 'no' && <XIcon className="w-5 h-5 text-destructive mx-auto" />}
                      {row.clerk === 'limited' && <Minus className="w-5 h-5 text-yellow-500 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Custom keyframes for animation */}
      <style>{`
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 8s ease-in-out infinite;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-fade-in {
          animation: fadeIn 1.2s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
        .animate-slide-up {
          animation: slideUp 1s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: none; }
        }
        .animate-bounce-slow {
          animation: bounceSlow 2.5s infinite;
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}; 