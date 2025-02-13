
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Shield, Zap, Wallet, CreditCard, PieChart, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Bank-Level Security",
      description: "Your money is protected by state-of-the-art encryption and security measures."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Transfers",
      description: "Send and receive money instantly, 24/7, with zero waiting time."
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      title: "Smart Budgeting",
      description: "Automatically categorize your spending and set intelligent savings goals."
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Virtual Cards",
      description: "Create virtual cards for online purchases with enhanced security."
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Get detailed insights into your spending patterns and financial health."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Joint Accounts",
      description: "Share accounts with family or friends while maintaining control."
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
                Features that empower you
              </h1>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Everything you need to take control of your finances, all in one place.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="p-6 rounded-2xl bg-surface border border-border hover:border-accent transition-colors">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-secondary">{feature.description}</p>
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

export default Features;
