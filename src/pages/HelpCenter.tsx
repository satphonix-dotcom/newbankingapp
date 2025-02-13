
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Search } from "lucide-react";

const HelpCenter = () => {
  const categories = [
    {
      title: "Account & Settings",
      articles: [
        "How to reset your password",
        "Managing account settings",
        "Two-factor authentication setup",
        "Updating personal information"
      ]
    },
    {
      title: "Payments & Transfers",
      articles: [
        "Making a transfer",
        "International payments",
        "Payment limits",
        "Transaction fees"
      ]
    },
    {
      title: "Security",
      articles: [
        "Keeping your account secure",
        "Reporting suspicious activity",
        "Device authorization",
        "Security best practices"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="px-6 lg:px-8 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
                Help Center
              </h1>
              <p className="text-lg text-secondary mb-8">
                Find answers to your questions and learn how to get the most out of BankApp.
              </p>
              <div className="max-w-xl mx-auto relative">
                <input
                  type="text"
                  placeholder="Search for help..."
                  className="w-full px-4 py-3 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <div key={index} className="p-6 rounded-2xl bg-surface border border-border">
                  <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
                  <ul className="space-y-3">
                    {category.articles.map((article, articleIndex) => (
                      <li key={articleIndex} className="text-secondary hover:text-primary cursor-pointer">
                        {article}
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

export default HelpCenter;
