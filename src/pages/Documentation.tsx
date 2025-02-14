import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="px-6 lg:px-8 py-24">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-primary mb-8">
              Documentation
            </h1>
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
                <p className="text-secondary">
                  Welcome to our comprehensive documentation. Here you'll find everything you need
                  to know about using our banking platform, from basic account setup to advanced
                  features and integrations.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
                <p className="text-secondary">
                  Our API documentation provides detailed information about endpoints,
                  authentication, and example requests. Perfect for developers looking to
                  integrate our services into their applications.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">User Guides</h2>
                <p className="text-secondary">
                  Step-by-step guides for all our features, including account management,
                  transfers, virtual cards, and more. Written in clear, easy-to-follow
                  language for users of all experience levels.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Security Guidelines</h2>
                <p className="text-secondary">
                  Learn about our security practices and how to keep your account safe.
                  Includes information about two-factor authentication, secure passwords,
                  and fraud prevention.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;
