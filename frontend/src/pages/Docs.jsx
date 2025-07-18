import { BookOpen, Code, Key, Users, Shield, Copy } from 'lucide-react';
import { useState } from 'react';
import Fuse from 'fuse.js';
import { useEffect, useRef } from 'react';

const docsSections = [
  {
    id: 'getting-started',
    title: 'Quick Start',
    icon: BookOpen,
    content: QuickStartSection,
  },
  {
    id: 'authentication',
    title: 'Authentication',
    icon: Shield,
    content: AuthSection,
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    icon: Code,
    content: ApiReferenceSection,
  },
  {
    id: 'security',
    title: 'Security',
    icon: Key,
    content: SecuritySection,
  },
  {
    id: 'examples',
    title: 'Code Examples',
    icon: Users,
    content: ExamplesSection,
  },
  {
    id: 'faq',
    title: 'FAQ',
    icon: Shield,
    content: FAQSection,
  },
];

function CodeBlock({ code, lang, onCopy }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    onCopy && onCopy();
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div className="relative group my-4">
      <pre className="rounded-lg bg-muted p-4 overflow-x-auto text-sm font-mono border border-border">
        <code>{code}</code>
      </pre>
      <button
        className="absolute top-2 right-2 p-1 rounded bg-background border border-border hover:bg-muted transition-colors text-xs flex items-center gap-1 opacity-80 group-hover:opacity-100"
        onClick={handleCopy}
        type="button"
      >
        <Copy className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}

function QuickStartSection() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">Register Your Project</h3>
        <p className="text-muted-foreground mb-4">
          Create a project to get your API key and start using AuthService.
        </p>
        <div className="mb-2 font-semibold">Request:</div>
        <CodeBlock
          lang="bash"
          code={`curl -X POST http://localhost:5000/api/projects/create \
  -H "Content-Type: application/json" \
  -d '{ "name": "My Awesome App" }'`}
        />
        <div className="mb-2 font-semibold">Response:</div>
        <CodeBlock
          lang="json"
          code={`{
  "message": "Project created successfully",
  "project": {
    "_id": "...",
    "name": "My Awesome App",
    "apiKey": "sk_..."
  }
}`}
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">Integrate Authentication</h3>
        <p className="text-muted-foreground mb-4">
          Use the API key in your application headers for all requests.
        </p>
        <CodeBlock
          lang="js"
          code={`fetch('/api/project-users/me', {
  headers: {
    'x-api-key': 'your_api_key_here',
    'Authorization': 'Bearer your_jwt_token_here'
  }
});`}
        />
      </div>
    </div>
  );
}

function AuthSection() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">Register a User</h3>
        <CodeBlock
          lang="bash"
          code={`curl -X POST http://localhost:5000/api/project-users/register \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key_here" \
  -d '{ "name": "John Doe", "email": "john@example.com", "password": "securepassword123" }'`}
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">Login a User</h3>
        <CodeBlock
          lang="bash"
          code={`curl -X POST http://localhost:5000/api/project-users/login \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key_here" \
  -d '{ "email": "john@example.com", "password": "securepassword123" }'`}
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">Get Current User</h3>
        <CodeBlock
          lang="bash"
          code={`curl -X GET http://localhost:5000/api/project-users/me \
  -H "Authorization: Bearer your_jwt_token_here" \
  -H "x-api-key: your_api_key_here"`}
        />
      </div>
    </div>
  );
}

function ApiReferenceSection() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">POST /api/project-users/register</h3>
        <div className="mb-2 font-semibold">Headers:</div>
        <ul className="list-disc ml-6 text-muted-foreground mb-2">
          <li>x-api-key: Your project API key</li>
          <li>Content-Type: application/json</li>
        </ul>
        <div className="mb-2 font-semibold">Body:</div>
        <CodeBlock
          lang="json"
          code={`{
  "name": "string",
  "email": "string",
  "password": "string"
}`}
        />
        <div className="mb-2 font-semibold">Response:</div>
        <CodeBlock
          lang="json"
          code={`{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": { "id": "user_id", "name": "John Doe", "email": "john@example.com", "project": "project_id" }
}`}
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">POST /api/project-users/login</h3>
        <div className="mb-2 font-semibold">Headers:</div>
        <ul className="list-disc ml-6 text-muted-foreground mb-2">
          <li>x-api-key: Your project API key</li>
          <li>Content-Type: application/json</li>
        </ul>
        <div className="mb-2 font-semibold">Body:</div>
        <CodeBlock
          lang="json"
          code={`{
  "email": "string",
  "password": "string"
}`}
        />
        <div className="mb-2 font-semibold">Response:</div>
        <CodeBlock
          lang="json"
          code={`{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": { "id": "user_id", "name": "John Doe", "email": "john@example.com", "project": "project_id" }
}`}
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">GET /api/project-users/me</h3>
        <div className="mb-2 font-semibold">Headers:</div>
        <ul className="list-disc ml-6 text-muted-foreground mb-2">
          <li>Authorization: Bearer jwt_token_here</li>
          <li>x-api-key: Your project API key</li>
        </ul>
        <div className="mb-2 font-semibold">Response:</div>
        <CodeBlock
          lang="json"
          code={`{
  "success": true,
  "user": { "id": "user_id", "name": "John Doe", "email": "john@example.com", "project": "project_id", "createdAt": "2024-01-01T00:00:00.000Z" }
}`}
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">GET /api/project-users/verify-email/:token</h3>
        <div className="mb-2 font-semibold">Description:</div>
        <p className="text-muted-foreground mb-2">Verify a project user's email address using the token sent via email.</p>
        <div className="mb-2 font-semibold">Example Request:</div>
        <CodeBlock
          lang="bash"
          code={`curl -X GET http://localhost:5000/api/project-users/verify-email/your_token_here`}
        />
        <div className="mb-2 font-semibold">Success Response:</div>
        <CodeBlock
          lang="json"
          code={`{
  "message": "Email verified successfully"
}`}
        />
        <div className="mb-2 font-semibold">Error Response:</div>
        <CodeBlock
          lang="json"
          code={`{
  "message": "Invalid or expired verification token"
}`}
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">POST /api/project-users/resend-otp</h3>
        <div className="mb-2 font-semibold">Description:</div>
        <p className="text-muted-foreground mb-2">Resend the verification email to a project user. Rate-limited to prevent abuse.</p>
        <div className="mb-2 font-semibold">Headers:</div>
        <ul className="list-disc ml-6 text-muted-foreground mb-2">
          <li>Content-Type: application/json</li>
        </ul>
        <div className="mb-2 font-semibold">Body:</div>
        <CodeBlock
          lang="json"
          code={`{
  "email": "user@example.com",
  "projectId": "project_id_here"
}`}
        />
        <div className="mb-2 font-semibold">Success Response:</div>
        <CodeBlock
          lang="json"
          code={`{
  "message": "OTP sent successfully."
}`}
        />
        <div className="mb-2 font-semibold">Error Response:</div>
        <CodeBlock
          lang="json"
          code={`{
  "message": "Email already verified."
}`}
        />
      </div>
    </div>
  );
}

function SecuritySection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">JWT Security</h3>
        <ul className="list-disc ml-6 text-muted-foreground">
          <li>JWT tokens are used for stateless authentication</li>
          <li>Tokens are signed with a secret key</li>
          <li>Tokens have an expiration time (default: 24 hours)</li>
          <li>Always use HTTPS in production</li>
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">API Key Security</h3>
        <ul className="list-disc ml-6 text-muted-foreground">
          <li>Keep your API key secure and never expose it in client-side code</li>
          <li>Use environment variables to store API keys</li>
          <li>Rotate API keys regularly</li>
          <li>Monitor API usage for suspicious activity</li>
        </ul>
      </div>
    </div>
  );
}

function ExamplesSection() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">JavaScript/Node.js</h3>
        <CodeBlock
          lang="js"
          code={`// Register a user
const registerUser = async (userData) => {
  const response = await fetch('http://localhost:5000/api/project-users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.PROJECT_API_KEY
    },
    body: JSON.stringify(userData)
  });
  return response.json();
};`}
        />
      </div>
    </div>
  );
}

function FAQSection() {
  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-foreground mb-4">Frequently Asked Questions</h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-lg text-foreground mb-1">What is AuthService?</h4>
          <p className="text-muted-foreground">AuthService is a self-hosted authentication platform for developers, offering secure, project-scoped user management, email verification, and modern developer UX.</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg text-foreground mb-1">How is this different from Auth0 or Clerk?</h4>
          <p className="text-muted-foreground">Unlike SaaS solutions, AuthService is open-source and fully under your control. You can self-host, customize, and extend it for your needs, with project-level isolation and analytics.</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg text-foreground mb-1">How does project user email verification work?</h4>
          <p className="text-muted-foreground">Each project user must verify their email via a unique link sent after registration. Admins can resend verification emails. Unverified users cannot log in.</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg text-foreground mb-1">Can I use my own SMTP provider?</h4>
          <p className="text-muted-foreground">Yes! Just set your SMTP credentials in the backend <code>.env</code> file. The system works with any standard SMTP server.</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg text-foreground mb-1">Is there a dark mode?</h4>
          <p className="text-muted-foreground">Yes, you can toggle between dark and light mode using the button in the navbar.</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg text-foreground mb-1">How do I get support or contribute?</h4>
          <p className="text-muted-foreground">Open an issue or pull request on our <a href="https://github.com/rusilkoirala/auth-service" target="_blank" rel="noopener noreferrer" className="text-primary underline">GitHub repository</a>.</p>
        </div>
      </div>
    </div>
  );
}

export const Docs = () => {
  const [active, setActive] = useState(docsSections[0].id);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState(docsSections);
  const searchInputRef = useRef(null);

  // Fuse.js setup
  const fuse = new Fuse(docsSections, {
    keys: ['title', 'content'],
    threshold: 0.3,
  });

  useEffect(() => {
    if (search.trim() === '') {
      setResults(docsSections);
    } else {
      const fuseResults = fuse.search(search).map(r => r.item);
      setResults(fuseResults.length ? fuseResults : []);
    }
  }, [search]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-2 md:px-8">
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <aside className="md:w-72 w-full md:sticky md:top-24 flex-shrink-0 mb-8 md:mb-0">
          <div className="bg-card/80 border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6 text-foreground tracking-tight">Docs Navigation</h2>
            <div className="relative mb-6">
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search docs (Ctrl+K/⌘+K)"
                className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                aria-label="Search documentation"
              />
              
            </div>
            <nav className="space-y-2">
              {results.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActive(section.id)}
                  className={`block w-full text-left px-3 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                    active === section.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  {section.title}
                </button>
              ))}
              {results.length === 0 && (
                <div className="text-muted-foreground text-sm px-3 py-2">No results found.</div>
              )}
            </nav>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 w-full">
          <div className="bg-card/90 border border-border rounded-2xl shadow-md p-8 md:p-12">
            <div className="mb-10">
              <h1 className="text-4xl font-extrabold text-foreground mb-2 tracking-tight">Documentation</h1>
              <p className="text-lg text-muted-foreground mb-2">Integrate AuthService into your app in minutes.</p>
              <div className="h-1 w-16 bg-gradient-to-r from-primary to-sky-400 rounded-full mb-2" />
            </div>
            {results.length > 0 && (
              <div>
                {docsSections.find((s) => s.id === active)?.content()}
              </div>
            )}
            {results.length === 0 && (
              <div className="text-muted-foreground text-center text-lg py-12">No documentation found for your search.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}; 