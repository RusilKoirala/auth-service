import { Link } from 'react-router-dom';
import { Shield, Zap, Lock, Users, ArrowRight, Check } from 'lucide-react';

export const Home = () => {
  const features = [
    {
      icon: Shield,
      title: 'Project-Scoped Authentication',
      description: 'Each project has its own isolated user base with secure authentication.',
    },
    {
      icon: Zap,
      title: 'Easy Integration',
      description: 'Simple API endpoints for login, registration, and user management.',
    },
    {
      icon: Lock,
      title: 'JWT Security',
      description: 'Industry-standard JWT tokens for secure, stateless authentication.',
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Track and manage users per project with detailed activity logs.',
    },
  ];

  const benefits = [
    'Self-hosted solution for complete control',
    'No vendor lock-in or recurring fees',
    'Customizable authentication flows',
    'Scalable architecture',
    'Developer-friendly APIs',
    'Comprehensive documentation',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                <Shield className="w-12 h-12 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Self-Hosted
              <span className="text-primary block">Authentication</span>
              for Developers
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Build secure authentication into your applications with our project-scoped 
              auth service. Like Auth0 or Clerk, but self-hosted and fully customizable.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/login"
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                to="/docs"
                className="btn-secondary text-lg px-8 py-4"
              >
                View Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need for authentication
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed for modern applications with security and scalability in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-6 text-center hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why choose AuthService?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Take control of your authentication infrastructure with a solution that grows with your needs.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Project: MyApp</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">Total Users</span>
                    <span className="font-semibold text-foreground">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">Active Sessions</span>
                    <span className="font-semibold text-foreground">89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">API Calls Today</span>
                    <span className="font-semibold text-foreground">12,456</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Link to="/login" className="btn-primary w-full text-center">
                    Start Your Project
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers who trust AuthService for their authentication needs.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}; 