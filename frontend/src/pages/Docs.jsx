import { BookOpen, Code, Key, Users, Shield, Copy } from 'lucide-react';
import { useState } from 'react';

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

export const Docs = () => {
  const [active, setActive] = useState(docsSections[0].id);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:block w-64 border-r border-border bg-card/80 backdrop-blur-lg">
        <div className="sticky top-20 p-8">
          <h2 className="text-lg font-bold mb-6 text-foreground">Docs Navigation</h2>
          <nav className="space-y-2">
            {docsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActive(section.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg w-full text-left transition-colors font-medium ${active === section.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/60 text-muted-foreground'}`}
              >
                <section.icon className="w-4 h-4" />
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-8 py-16">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Documentation</h1>
            <p className="text-lg text-muted-foreground">Integrate AuthService into your app in minutes.</p>
          </div>
        </div>
        <div className="space-y-12">
          {docsSections.filter(s => s.id === active).map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <section.icon className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
              </div>
              <section.content />
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}; 