import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Search, MessageCircle, FileText, Phone } from "lucide-react";

const HelpCenter = () => {
  const categories = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "FAQ",
      description: "Find answers to commonly asked questions",
      link: "#faq"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Guides",
      description: "Step-by-step guides for using our services",
      link: "#guides"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Support",
      description: "Get in touch with our support team",
      link: "#support"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="px-6 lg:px-8 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
                How can we help you?
              </h1>
              <p className="text-lg text-secondary max-w-2xl mx-auto mb-8">
                Search our knowledge base or browse categories below to find the help you need.
              </p>
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <a
                  key={index}
                  href={category.link}
                  className="p-6 rounded-2xl bg-surface border border-border hover:border-accent transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 text-primary">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                  <p className="text-secondary">{category.description}</p>
                </a>
              ))}
            </div>

            <div className="mt-16 text-center">
              <h2 className="text-2xl font-semibold mb-4">Still need help?</h2>
              <p className="text-secondary mb-6">
                Our support team is available 24/7 to assist you with any questions.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;
