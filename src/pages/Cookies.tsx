
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Cookies = () => {
  const cookieTypes = [
    {
      type: "Essential Cookies",
      description: "These cookies are necessary for the website to function and cannot be switched off in our systems.",
      examples: ["Session Management", "Load Balancing", "Security"]
    },
    {
      type: "Performance Cookies",
      description: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.",
      examples: ["Analytics", "Error Monitoring", "Speed Optimization"]
    },
    {
      type: "Functional Cookies",
      description: "These cookies enable the website to provide enhanced functionality and personalization.",
      examples: ["Language Preferences", "User Settings", "Live Chat Services"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="px-6 lg:px-8 py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-primary mb-8">
              Cookie Policy
            </h1>
            
            <p className="text-secondary mb-8">
              We use cookies and similar technologies to provide, protect, and improve our services.
              This policy explains how and why we use these technologies and the choices you have.
            </p>

            <div className="space-y-8">
              {cookieTypes.map((cookie, index) => (
                <div key={index} className="p-6 rounded-2xl bg-surface border border-border">
                  <h2 className="text-xl font-semibold mb-3">{cookie.type}</h2>
                  <p className="text-secondary mb-4">{cookie.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {cookie.examples.map((example, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-surface border border-border">
              <h2 className="text-xl font-semibold mb-4">Managing Your Cookie Preferences</h2>
              <p className="text-secondary mb-4">
                Most web browsers allow you to manage your cookie preferences. You can set your browser
                to refuse cookies, or delete certain cookies. Generally you also have the ability to
                manage similar technologies in the same way that you manage cookies.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Cookies;
