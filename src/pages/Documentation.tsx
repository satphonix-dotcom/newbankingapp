
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Documentation = () => {
  const sections = [
    {
      title: "Getting Started",
      content: "Learn how to integrate BankApp into your application with our comprehensive documentation.",
      subsections: [
        "Quick Start Guide",
        "Installation",
        "Authentication",
        "API Overview"
      ]
    },
    {
      title: "Core Concepts",
      content: "Understand the fundamental concepts behind BankApp's architecture.",
      subsections: [
        "Account Management",
        "Transactions",
        "Security Features",
        "Webhooks"
      ]
    },
    {
      title: "API Reference",
      content: "Detailed documentation of all available API endpoints and their usage.",
      subsections: [
        "REST API",
        "GraphQL API",
        "Error Handling",
        "Rate Limits"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="px-6 lg:px-8 py-24">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
              Documentation
            </h1>
            <p className="text-lg text-secondary mb-12">
              Everything you need to know about BankApp's features and APIs.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sections.map((section, index) => (
                <div key={index} className="p-6 rounded-2xl bg-surface border border-border">
                  <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                  <p className="text-secondary mb-4">{section.content}</p>
                  <ul className="space-y-2">
                    {section.subsections.map((subsection, subIndex) => (
                      <li key={subIndex} className="text-primary hover:text-accent cursor-pointer">
                        {subsection}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;
